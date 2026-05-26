import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { College } from '../types';
import API from '../services/api';

import { CollegeLogo, EmptyState } from '../components/ui';
import { formatMoney, formatFees } from '../utils/format';

// Helper to get a stable ID from a college
const getId = (c: College): string => c._id || String(c.id);

interface CompareRow {
  label: string;
  render: (c: College) => string;
  best?: (colleges: College[]) => string;
}

const COMPARE_ROWS: CompareRow[] = [
  { label: 'Location', render: (c) => `${c.city}, ${c.state}` },
  { label: 'Type', render: (c) => c.type },
  { label: 'Tier', render: (c) => c.tier },
  {
    label: 'Annual Fees',
    render: (c) => formatFees(c.fees),
    best: (cs) => getId(cs.reduce((a, b) => (a.fees < b.fees ? a : b))),
  },
  {
    label: 'Avg Package',
    render: (c) => formatMoney(c.placements.avg),
    best: (cs) =>
      getId(cs.reduce((a, b) => (a.placements.avg > b.placements.avg ? a : b))),
  },
  {
    label: 'Highest Package',
    render: (c) => formatMoney(c.placements.highest),
    best: (cs) =>
      getId(
        cs.reduce((a, b) =>
          a.placements.highest > b.placements.highest ? a : b
        )
      ),
  },
  {
    label: 'Placement Rate',
    render: (c) => `${c.placements.rate}%`,
    best: (cs) =>
      getId(
        cs.reduce((a, b) =>
          a.placements.rate > b.placements.rate ? a : b
        )
      ),
  },
  {
    label: 'Overall Rating',
    render: (c) => `${c.rating}/5 ⭐`,
    best: (cs) =>
      getId(cs.reduce((a, b) => (a.rating > b.rating ? a : b))),
  },
  { label: 'Intake Exam', render: (c) => c.intake },
  { label: 'Cutoff Rank', render: (c) => c.cutoff.toLocaleString() },
  { label: 'Total Seats', render: (c) => c.seats.toLocaleString() },
  { label: 'Established', render: (c) => String(c.estd) },
  { label: 'Accreditation', render: (c) => c.accreditation },
];

interface ComparePageProps {
  compareList: string[];
}

const ComparePage: React.FC<ComparePageProps> = ({ compareList }) => {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);

        const response = await API.get('/colleges');

        const allColleges: College[] = Array.isArray(response.data)
          ? response.data
          : response.data.colleges ?? [];

        // ✅ FIXED: use getId() so both _id and numeric id work
        const selected = allColleges.filter((c) =>
          compareList.includes(getId(c))
        );

        setColleges(selected);
      } catch (err) {
        console.error('Failed to fetch colleges for compare:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [compareList]);

  const backButtonStyle: React.CSSProperties = {
    padding: '10px 18px',
    borderRadius: 14,
    border: 'none',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    marginBottom: 18,
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
    fontFamily: 'inherit',
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 60,
          fontSize: 16,
          fontWeight: 600,
          color: '#64748b',
        }}
      >
        Loading comparison...
      </div>
    );
  }

  if (colleges.length < 2) {
    return (
      <div>
        <button onClick={() => navigate('/')} style={backButtonStyle}>
          ← Back
        </button>

        <EmptyState
          emoji="⚖️"
          title="Add at least 2 colleges to compare"
          subtitle="Browse colleges and click '+ Compare' to add them here (max 3)"
          actionLabel="Browse Colleges"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
      {/* BACK BUTTON */}
      <button onClick={() => navigate('/')} style={backButtonStyle}>
        ← Back
      </button>

      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#111827' }}>
          College Comparison
        </h1>

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 18px',
            borderRadius: 12,
            border: '1.5px solid #2563eb',
            background: '#fff',
            color: '#2563eb',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Add More Colleges
        </button>
      </div>

      {/* TABLE */}
      <div
        style={{
          overflowX: 'auto',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
          background: '#fff',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: 700,
          }}
        >
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                PARAMETER
              </th>

              {colleges.map((college) => (
                <th
                  key={getId(college)}
                  style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      justifyContent: 'center',
                    }}
                  >
                    <CollegeLogo college={college} size={36} />

                    <div>
                      <div
                        style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}
                      >
                        {college.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        {college.city}
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {COMPARE_ROWS.map((row, ri) => {
              const bestId = row.best ? row.best(colleges) : null;

              return (
                <tr
                  key={row.label}
                  style={{ background: ri % 2 === 0 ? '#fff' : '#fafafa' }}
                >
                  <td
                    style={{
                      padding: '14px 16px',
                      fontWeight: 700,
                      borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    {row.label}
                  </td>

                  {colleges.map((college) => {
                    // ✅ FIXED: compare using getId()
                    const isBest = bestId !== null && bestId === getId(college);

                    return (
                      <td
                        key={getId(college)}
                        style={{
                          padding: '14px 16px',
                          textAlign: 'center',
                          borderBottom: '1px solid #f3f4f6',
                          background: isBest ? '#ecfdf5' : 'transparent',
                          color: isBest ? '#047857' : '#374151',
                          fontWeight: isBest ? 700 : 500,
                        }}
                      >
                        {isBest && (
                          <span style={{ marginRight: 4, color: '#10b981' }}>
                            ✓
                          </span>
                        )}
                        {row.render(college)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* LEGEND */}
      <div
        style={{
          marginTop: 20,
          padding: '12px 16px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 10,
          fontSize: 13,
          color: '#92400e',
        }}
      >
        <strong>✓ Legend:</strong> Green highlighted cells indicate the best
        value for that parameter across selected colleges.
      </div>
    </div>
  );
};

export default ComparePage;