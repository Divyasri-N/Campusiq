import {
  useState,
  useMemo,
  useEffect,
} from 'react';

import type {
  College,
  CollegeFilters,
  SortOption,
} from '../types';

import API from '../services/api';

import CollegeCard from '../components/CollegeCard';
import FilterSidebar from '../components/FilterSidebar';
import { EmptyState } from '../components/ui';

const DEFAULT_FILTERS: CollegeFilters = {
  state: '',
  type: '',
  tier: '',
  maxFees: 3_000_000,
  minRating: 0,
};

const PER_PAGE = 6;

interface ListingPageProps {
  onView: (id: string) => void;
  compareList: string[];
  onToggleCompare: (id: string) => void;
  onGoCompare: () => void;
}

const ListingPage: React.FC<ListingPageProps> = ({
  onView,
  compareList,
  onToggleCompare,
  onGoCompare,
}) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<CollegeFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>('rating');
  const [page, setPage] = useState(1);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const response = await API.get('/colleges');

        if (Array.isArray(response.data)) {
          setColleges(response.data);
        } else if (Array.isArray(response.data.colleges)) {
          setColleges(response.data.colleges);
        } else {
          setColleges([]);
        }

        setError('');
      } catch (err) {
        console.error('Backend Connection Error:', err);
        setError('Unable to connect to backend server.');
        setColleges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const setFilter = (key: keyof CollegeFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch('');
    setPage(1);
  };

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return colleges
      .filter((college) => {
        if (
          query &&
          !college.name.toLowerCase().includes(query) &&
          !college.city.toLowerCase().includes(query) &&
          !college.state.toLowerCase().includes(query)
        ) return false;

        if (filters.state && college.state !== filters.state) return false;
        if (filters.type && college.type !== filters.type) return false;
        if (filters.tier && college.tier !== filters.tier) return false;
        if (college.fees > filters.maxFees) return false;
        if (college.rating < filters.minRating) return false;

        return true;
      })
      .sort((a, b) => {
        switch (sort) {
          case 'rating':    return b.rating - a.rating;
          case 'fees_asc':  return a.fees - b.fees;
          case 'fees_desc': return b.fees - a.fees;
          case 'placement': return b.placements.avg - a.placements.avg;
          default:          return 0;
        }
      });
  }, [search, filters, sort, colleges]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  // Helper to get stable ID — uses _id if available, falls back to string id
  const getCollegeId = (college: College) =>
    college._id || String(college.id);

  return (
    <div>
      {/* HERO SECTION */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
          borderRadius: 20,
          padding: '36px 32px',
          marginBottom: 26,
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
        }}
      >
        <h1
          style={{
            color: '#ffffff',
            margin: '0 0 10px',
            fontSize: 32,
            fontWeight: 700,
            fontFamily: 'Georgia, serif',
          }}
        >
          Find Your College
        </h1>

        <p style={{ color: '#cbd5e1', marginBottom: 24, fontSize: 15 }}>
          Search from {colleges.length} colleges across India
        </p>

        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: 16,
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: 18,
              pointerEvents: 'none',
            }}
          >
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by college name, city, or state..."
            style={{
              width: '100%',
              padding: '14px 18px 14px 48px',
              borderRadius: 12,
              border: '1.5px solid #334155',
              background: '#1e293b',
              color: '#ffffff',
              fontSize: 15,
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
        <FilterSidebar
          filters={filters}
          sort={sort}
          onFilterChange={setFilter}
          onSortChange={(value) => { setSort(value); setPage(1); }}
          onReset={handleReset}
          resultCount={filtered.length}
        />

        <div style={{ flex: 1 }}>
          {/* COMPARE BANNER */}
          {compareList.length > 0 && (
            <div
              style={{
                background: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: 13, color: '#1d4ed8', fontWeight: 600 }}>
                {compareList.length} college{compareList.length > 1 ? 's' : ''} selected to compare
              </span>
              <span style={{ flex: 1 }} />
              {compareList.length >= 2 && (
                <button
                  onClick={onGoCompare}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1d4ed8',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  View Comparison →
                </button>
              )}
              {compareList.length < 2 && (
                <span style={{ fontSize: 12, color: '#60a5fa' }}>
                  Add {2 - compareList.length} more to compare
                </span>
              )}
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div
              style={{
                textAlign: 'center',
                padding: 50,
                fontSize: 18,
                fontWeight: 600,
                color: '#64748b',
              }}
            >
              Loading colleges...
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <EmptyState
              emoji="⚠️"
              title="Backend Connection Failed"
              subtitle={error}
              actionLabel="Refresh Page"
              onAction={() => window.location.reload()}
            />
          )}

          {/* EMPTY */}
          {!loading && !error && paginated.length === 0 && (
            <EmptyState
              emoji="🏫"
              title="No colleges found"
              subtitle="Try adjusting your filters or search query"
              actionLabel="Reset Filters"
              onAction={handleReset}
            />
          )}

          {/* COLLEGE CARDS */}
          {!loading && !error && paginated.length > 0 &&
            paginated.map((college) => (
              <CollegeCard
                key={getCollegeId(college)}
                college={college}
                onView={() => onView(getCollegeId(college))}
                isInCompare={compareList.includes(getCollegeId(college))}
                onToggleCompare={() => onToggleCompare(getCollegeId(college))}
                compareDisabled={
                  compareList.length >= 3 &&
                  !compareList.includes(getCollegeId(college))
                }
              />
            ))}

          {/* LOAD MORE BUTTON */}
          {!loading && !error && hasMore && (
            <div style={{ textAlign: 'center', marginTop: 26 }}>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                style={{
                  padding: '11px 34px',
                  borderRadius: 12,
                  border: '1.5px solid #2563eb',
                  background: '#ffffff',
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#2563eb';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Load More ({filtered.length - paginated.length} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingPage;