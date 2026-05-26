import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { College } from '../types';
import API from '../services/api';

import { CollegeLogo, EmptyState } from '../components/ui';
import { formatMoney, formatFees } from '../utils/format';

// ← fixed: best() returns string (_id) instead of number
interface CompareRow {
  label: string;
  render: (c: College) => string;
  best?: (colleges: College[]) => string;
}

const COMPARE_ROWS: CompareRow[] = [
  { label: 'Location',      render: (c) => `${c.city}, ${c.state}` },
  { label: 'Type',          render: (c) => c.type },
  { label: 'Tier',          render: (c) => c.tier },
  {
    label: 'Annual Fees',
    render: (c) => formatFees(c.fees),
    best: (cs) => cs.reduce((a, b) => (a.fees < b.fees ? a : b))._id,  // ← fixed
  },
  {
    label: 'Avg Package',
    render: (c) => formatMoney(c.placements.avg),
    best: (cs) =>
      cs.reduce((a, b) => (a.placements.avg > b.placements.avg ? a : b))._id, // ← fixed
  },
  {
    label: 'Highest Package',
    render: (c) => formatMoney(c.placements.highest),
    best: (cs) =>
      cs.reduce((a, b) =>
        a.placements.highest > b.placements.highest ? a : b
      )._id, // ← fixed
  },
  {
    label: 'Placement Rate',
    render: (c) => `${c.placements.rate}%`,
    best: (cs) =>
      cs.reduce((a, b) =>
        a.placements.rate > b.placements.rate ? a : b
      )._id, // ← fixed
  },
  {
    label: 'Overall Rating',
    render: (c) => `${c.rating}/5 ⭐`,
    best: (cs) =>
      cs.reduce((a, b) => (a.rating > b.rating ? a : b))._id, // ← fixed
  },
  { label: 'Intake Exam',   render: (c) => c.intake },
  { label: 'Cutoff Rank',   render: (c) => c.cutoff.toLocaleString() },
  { label: 'Total Seats',   render: (c) => c.seats.toLocaleString() },
  { label: 'Established',   render: (c) => String(c.estd) },
  { label: 'Accreditation', render: (c) => c.accreditation },
];

interface ComparePageProps {
  compareList: string[];  // ← fixed: string[] instead of number[]
}

const ComparePage: React.FC<ComparePageProps> = ({ compareList }) => {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH ALL COLLEGES THEN FILTER BY compareList
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const response = await API.get('/colleges');
        const allColleges: College[] = Array.isArray(response.data)
          ? response.data
          : response.data.colleges ?? [];

        // Filter only the ones in compareList using _id
        const selected = allColleges.filter((c) =>
          compareList.includes(c._id)
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

  // LOADING STATE
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

  // EMPTY STATE — less than 2 colleges selected
  if (colleges.length < 2) {
    return (
      <div>
        <button
          onClick={() => navigate('/')}
          style={backButtonStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(37,99,235,0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0px) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,99,235,0.25)';
          }}
        >
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
      <button
        onClick={() => navigate('/')}
        style={backButtonStyle}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(37,99,235,0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0px) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,99,235,0.25)';
        }}
      >
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
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: '#111827',
          }}
        >
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
            transition: 'all 0.25s ease',
            fontFamily: 'inherit',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#eff6ff';
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          + Add More Colleges
        </button>
      </div>

      {/* COMPARISON TABLE */}
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
                  fontSize: 13,
                  color: '#6b7280',
                  fontWeight: 700,
                  letterSpacing: 0.4,
                }}
              >
                PARAMETER
              </th>

              {colleges.map((college) => (
                <th
                  key={college._id}  // ← fixed: use _id
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #e5e7eb',
                  }}
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
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: '#111827',
                        }}
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
                      fontSize: 13,
                      color: '#374151',
                    }}
                  >
                    {row.label}
                  </td>

                  {colleges.map((college) => {
                    const isBest = bestId === college._id;  // ← fixed: use _id

                    return (
                      <td
                        key={college._id}  // ← fixed: use _id
                        style={{
                          padding: '14px 16px',
                          textAlign: 'center',
                          borderBottom: '1px solid #f3f4f6',
                          background: isBest ? '#ecfdf5' : 'transparent',
                          color: isBest ? '#047857' : '#374151',
                          fontWeight: isBest ? 700 : 500,
                          fontSize: 14,
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
        <strong>✓ Legend:</strong> Green highlighted cells indicate the
        best value for that parameter across selected colleges.
      </div>
    </div>
  );
};

export default ComparePage;