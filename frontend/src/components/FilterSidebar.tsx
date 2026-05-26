import React from 'react';
import type { CollegeFilters, SortOption } from '../types';
import { STATES, TYPES, TIERS } from '../data/colleges';
import { formatFees } from '../utils/format';

interface FilterSidebarProps {
  filters: CollegeFilters;
  sort: SortOption;
  onFilterChange: (
    key: keyof CollegeFilters,
    value: string | number
  ) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
  resultCount: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  sort,
  onFilterChange,
  onSortChange,
  onReset,
  resultCount,
}) => {
  return (
    <aside
      style={{
        width: 220,
        padding: 20,
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        background: '#fff',
      }}
    >
      <h3 style={{ marginBottom: 16 }}>
        Filters ({resultCount})
      </h3>

      <div style={{ marginBottom: 16 }}>
        <label>Sort By</label>

        <select
          value={sort}
          onChange={(e) =>
            onSortChange(e.target.value as SortOption)
          }
          style={{ width: '100%', padding: 8 }}
        >
          <option value="rating">Top Rated</option>
          <option value="fees_asc">Fees Low to High</option>
          <option value="fees_desc">Fees High to Low</option>
          <option value="placement">Best Placements</option>
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>State</label>

        <select
          value={filters.state}
          onChange={(e) =>
            onFilterChange('state', e.target.value)
          }
          style={{ width: '100%', padding: 8 }}
        >
          <option value="">All States</option>

          {STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>College Type</label>

        <select
          value={filters.type}
          onChange={(e) =>
            onFilterChange('type', e.target.value)
          }
          style={{ width: '100%', padding: 8 }}
        >
          <option value="">All Types</option>

          {TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>Tier</label>

        <select
          value={filters.tier}
          onChange={(e) =>
            onFilterChange('tier', e.target.value)
          }
          style={{ width: '100%', padding: 8 }}
        >
          <option value="">All Tiers</option>

          {TIERS.map((tier) => (
            <option key={tier} value={tier}>
              {tier}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>
          Max Fees: {formatFees(filters.maxFees)}
        </label>

        <input
          type="range"
          min={0}
          max={3000000}
          step={50000}
          value={filters.maxFees}
          onChange={(e) =>
            onFilterChange(
              'maxFees',
              Number(e.target.value)
            )
          }
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>
          Minimum Rating: {filters.minRating}
        </label>

        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={filters.minRating}
          onChange={(e) =>
            onFilterChange(
              'minRating',
              Number(e.target.value)
            )
          }
          style={{ width: '100%' }}
        />
      </div>

      <button
        onClick={onReset}
        style={{
          width: '100%',
          padding: 10,
          borderRadius: 8,
          border: 'none',
          background: '#2563eb',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Reset Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;