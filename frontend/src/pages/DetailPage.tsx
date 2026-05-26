import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { College } from '../types';
import API from '../services/api';
import {
  CollegeLogo,
  Badge,
  RatingBar,
  SectionCard,
} from '../components/ui';
import { formatMoney, formatFees } from '../utils/format';

type Tab = 'overview' | 'courses' | 'placements' | 'reviews';

interface Review {
  name: string;
  year: string;
  rating: number;
  text: string;
  tag: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    name: 'Rahul M.',
    year: '2023 Graduate',
    rating: 5,
    text: 'Exceptional faculty and world-class infrastructure. Placement support was outstanding with top MNCs visiting campus every semester.',
    tag: 'Placements',
  },
  {
    name: 'Priya S.',
    year: '2022 Graduate',
    rating: 4,
    text: 'Great learning environment and research facilities are truly world-class. The alumni network opened doors I never expected.',
    tag: 'Campus Life',
  },
  {
    name: 'Arjun K.',
    year: '2024 Student',
    rating: 4,
    text: 'Competitive atmosphere keeps you motivated. Internship opportunities through the alumni network are excellent for career growth.',
    tag: 'Internships',
  },
];

const TOP_RECRUITERS = [
  'Google',
  'Microsoft',
  'Amazon',
  'Infosys',
  'TCS',
  'Wipro',
];

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // ← gets _id from URL
  const navigate = useNavigate();

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');

  // FETCH COLLEGE BY _id FROM BACKEND
  useEffect(() => {
    const fetchCollege = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/colleges/${id}`);
        setCollege(response.data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch college:', err);
        setError('College not found.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCollege();
    }
  }, [id]);

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
        Loading college details...
      </div>
    );
  }

  // ERROR STATE
  if (error || !college) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: 'center',
          color: '#9ca3af',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>😔</div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#374151',
            marginBottom: 8,
          }}
        >
          {error || 'College not found.'}
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            color: '#3b82f6',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'inherit',
          }}
        >
          ← Back to Listings
        </button>
      </div>
    );
  }

  const tabs: Tab[] = ['overview', 'courses', 'placements', 'reviews'];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          border: 'none',
          color: '#3b82f6',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
          padding: '0 0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'inherit',
        }}
      >
        ← Back to Listings
      </button>

      {/* HERO */}
      <div
        style={{
          background:
            'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
          borderRadius: 16,
          padding: '28px',
          marginBottom: 24,
          color: '#fff',
        }}
      >
        <div
          style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}
        >
          <CollegeLogo college={college} size={72} />

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginBottom: 8,
                flexWrap: 'wrap',
              }}
            >
              <Badge
                color={college.tier === 'Tier 1' ? 'blue' : 'amber'}
              >
                {college.tier}
              </Badge>
              <Badge color="purple">{college.type}</Badge>
              <Badge color="green">{college.accreditation}</Badge>
            </div>

            <h1
              style={{
                margin: '0 0 6px',
                fontSize: 26,
                fontWeight: 700,
                fontFamily: 'Georgia, serif',
              }}
            >
              {college.name}
            </h1>

            <p
              style={{
                margin: '0 0 18px',
                color: '#94a3b8',
                fontSize: 14,
              }}
            >
              📍 {college.city}, {college.state} &nbsp;·&nbsp; 📅 Est.{' '}
              {college.estd} &nbsp;·&nbsp; 🎓{' '}
              {college.seats.toLocaleString()} seats
            </p>

            <div
              style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}
            >
              {[
                {
                  label: 'RATING',
                  value: `${college.rating}/5`,
                  icon: '⭐',
                },
                {
                  label: 'AVG PACKAGE',
                  value: formatMoney(college.placements.avg),
                  icon: '💰',
                },
                {
                  label: 'PLACEMENT %',
                  value: `${college.placements.rate}%`,
                  icon: '🎯',
                },
                {
                  label: 'ANNUAL FEES',
                  value: formatFees(college.fees),
                  icon: '🏦',
                },
              ].map((m) => (
                <div key={m.label}>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#64748b',
                      letterSpacing: 0.8,
                      fontWeight: 700,
                    }}
                  >
                    {m.icon} {m.label}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          background: '#f3f4f6',
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 9,
              border: 'none',
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? '#111827' : '#6b7280',
              fontWeight: tab === t ? 700 : 500,
              fontSize: 14,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.15s',
              boxShadow:
                tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              fontFamily: 'inherit',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TAB: OVERVIEW */}
      {tab === 'overview' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          <SectionCard title="Quick Facts">
            {[
              ['Intake Exam', college.intake],
              ['Cutoff Rank', college.cutoff.toLocaleString()],
              ['Total Seats', college.seats.toLocaleString()],
              ['Established', String(college.estd)],
              ['Accreditation', college.accreditation],
              [
                'Student Reviews',
                `${college.reviews.toLocaleString()} reviews`,
              ],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #f3f4f6',
                  fontSize: 14,
                }}
              >
                <span style={{ color: '#6b7280' }}>{k}</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>
                  {v}
                </span>
              </div>
            ))}
          </SectionCard>

          <SectionCard title="College Ratings">
            <RatingBar label="Faculty Quality" value={4.7} />
            <RatingBar label="Infrastructure" value={4.4} />
            <RatingBar
              label="Placement Support"
              value={college.placements.rate / 20}
            />
            <RatingBar label="Student Life" value={4.0} />
            <RatingBar
              label="Value for Money"
              value={
                college.fees < 100_000
                  ? 4.8
                  : college.fees < 500_000
                  ? 3.8
                  : 2.9
              }
            />
          </SectionCard>
        </div>
      )}

      {/* TAB: COURSES */}
      {tab === 'courses' && (
        <SectionCard title="Available Courses">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 12,
            }}
          >
            {college.courses.map((c) => (
              <div
                key={c}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  padding: '14px 16px',
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#111827',
                  }}
                >
                  {c}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#9ca3af',
                    marginTop: 4,
                  }}
                >
                  Full Time · {college.intake}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* TAB: PLACEMENTS */}
      {tab === 'placements' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          <SectionCard title="Placement Statistics">
            {[
              {
                label: 'Average Package',
                value: formatMoney(college.placements.avg),
                color: '#059669',
              },
              {
                label: 'Highest Package',
                value: formatMoney(college.placements.highest),
                color: '#3b82f6',
              },
              {
                label: 'Placement Rate',
                value: `${college.placements.rate}%`,
                color: '#7c3aed',
              },
              {
                label: 'Median Package',
                value: formatMoney(
                  Math.round(college.placements.avg * 0.8)
                ),
                color: '#f59e0b',
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <span style={{ fontSize: 14, color: '#6b7280' }}>
                  {s.label}
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: s.color,
                  }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </SectionCard>

          <SectionCard title="Top Recruiters">
            {TOP_RECRUITERS.map((r) => (
              <div
                key={r}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#374151',
                  }}
                >
                  {r[0]}
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#111827',
                  }}
                >
                  {r}
                </span>
              </div>
            ))}
          </SectionCard>
        </div>
      )}

      {/* TAB: REVIEWS */}
      {tab === 'reviews' && (
        <div>
          <div
            style={{ display: 'flex', gap: 16, marginBottom: 20 }}
          >
            {/* Aggregate score */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 14,
                padding: 20,
                textAlign: 'center',
                minWidth: 140,
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: '#111827',
                }}
              >
                {college.rating}
              </div>
              <div style={{ fontSize: 20, color: '#f59e0b' }}>
                {'★'.repeat(Math.floor(college.rating))}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: '#6b7280',
                  marginTop: 4,
                }}
              >
                {college.reviews.toLocaleString()} reviews
              </div>
            </div>

            {/* Star distribution */}
            <div
              style={{
                flex: 1,
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 14,
                padding: 20,
              }}
            >
              {([5, 4, 3, 2, 1] as const).map((s) => {
                const pct =
                  s === 5
                    ? 58
                    : s === 4
                    ? 25
                    : s === 3
                    ? 10
                    : s === 2
                    ? 4
                    : 3;
                return (
                  <div
                    key={s}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: '#6b7280',
                        minWidth: 12,
                      }}
                    >
                      {s}
                    </span>
                    <span style={{ color: '#f59e0b', fontSize: 13 }}>
                      ★
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        background: '#f3f4f6',
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          height: 8,
                          borderRadius: 4,
                          background: '#f59e0b',
                          width: `${pct}%`,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: '#9ca3af',
                        minWidth: 30,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review cards */}
          {MOCK_REVIEWS.map((review, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 14,
                padding: 20,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#e0e7ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#4338ca',
                    }}
                  >
                    {review.name[0]}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#111827',
                      }}
                    >
                      {review.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>
                      {review.year}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <Badge color="blue">{review.tag}</Badge>
                  <span style={{ color: '#f59e0b' }}>
                    {'★'.repeat(review.rating)}
                  </span>
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: '#374151',
                  lineHeight: 1.7,
                }}
              >
                {review.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailPage;