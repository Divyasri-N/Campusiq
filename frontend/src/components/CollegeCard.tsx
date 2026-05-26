import React from 'react';
import type { College } from '../types';
import { CollegeLogo, Badge } from './ui';
import { formatMoney, formatFees } from '../utils/format';

interface CollegeCardProps {
  college: College;
  onView: (id: string) => void;          // ← fixed: string
  isInCompare: boolean;
  onToggleCompare: (id: string) => void; // ← fixed: string
  compareDisabled: boolean;
}

const CollegeCard: React.FC<CollegeCardProps> = ({
  college,
  onView,
  isInCompare,
  onToggleCompare,
  compareDisabled,
}) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <article
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: '20px',
        marginBottom: 14,
        transition: 'box-shadow 0.2s',
        boxShadow: hovered
          ? '0 4px 20px rgba(0,0,0,0.08)'
          : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', gap: 16 }}>
        {/* Logo */}
        <CollegeLogo college={college} size={52} />

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 4,
            }}
          >
            <h2
              onClick={() => onView(college._id)}  // ← fixed: _id
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: '#111827',
                cursor: 'pointer',
              }}
            >
              {college.name}
            </h2>
            <Badge
              color={
                college.tier === 'Tier 1' ? 'blue' : 'amber'
              }
            >
              {college.tier}
            </Badge>
          </div>

          <p
            style={{
              margin: '0 0 12px',
              fontSize: 13,
              color: '#6b7280',
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <span>
              📍 {college.city}, {college.state}
            </span>
            <span>🏛️ {college.type}</span>
            <span>📅 Est. {college.estd}</span>
          </p>

          {/* Stats row */}
          <div
            style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}
          >
            {[
              {
                label: 'FEES',
                value: formatFees(college.fees),
                color: '#111827',
              },
              {
                label: 'AVG PACKAGE',
                value: formatMoney(college.placements.avg),
                color: '#059669',
              },
              {
                label: 'PLACEMENT',
                value: `${college.placements.rate}%`,
                color: '#111827',
              },
              {
                label: 'RATING',
                value: `${college.rating} ⭐`,
                color: '#f59e0b',
              },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: 10,
                    color: '#9ca3af',
                    fontWeight: 700,
                    letterSpacing: 0.6,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => onView(college._id)}  // ← fixed: _id
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: '#3b82f6',
              color: '#fff',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            View Details
          </button>

          <button
            onClick={() => onToggleCompare(college._id)}  // ← fixed: _id
            disabled={!isInCompare && compareDisabled}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: `1.5px solid ${
                isInCompare ? '#dc2626' : '#d1d5db'
              }`,
              background: isInCompare ? '#fef2f2' : '#f9fafb',
              color: isInCompare ? '#dc2626' : '#374151',
              fontWeight: 600,
              fontSize: 13,
              cursor:
                !isInCompare && compareDisabled
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                !isInCompare && compareDisabled ? 0.5 : 1,
              fontFamily: 'inherit',
            }}
          >
            {isInCompare ? '✓ Added' : '+ Compare'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default CollegeCard;