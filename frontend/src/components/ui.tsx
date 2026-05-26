import React from 'react';
import type { College } from '../types';

// ─── CollegeLogo ──────────────────────────────────────────────────────────────
interface CollegeLogoProps {
  college: College;
  size?: number;
}

export const CollegeLogo: React.FC<CollegeLogoProps> = ({ college, size = 44 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 10,
      background: college.color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 700,
      fontSize: size * 0.32,
      flexShrink: 0,
      fontFamily: 'Georgia, serif',
      letterSpacing: 1,
    }}
  >
    {college.logo}
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeColor = 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
}

const BADGE_COLORS: Record<BadgeColor, { bg: string; text: string }> = {
  blue:   { bg: '#e8f0fe', text: '#1a56db' },
  green:  { bg: '#e3f9e5', text: '#0d6e22' },
  amber:  { bg: '#fef3c7', text: '#92400e' },
  red:    { bg: '#fde8e8', text: '#9b1c1c' },
  purple: { bg: '#ede9fe', text: '#5521b5' },
  gray:   { bg: '#f3f4f6', text: '#374151' },
};

export const Badge: React.FC<BadgeProps> = ({ children, color = 'blue' }) => {
  const c = BADGE_COLORS[color];
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 20,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
};

// ─── RatingBar ────────────────────────────────────────────────────────────────
interface RatingBarProps {
  label: string;
  value: number;
  max?: number;
}

export const RatingBar: React.FC<RatingBarProps> = ({ label, value, max = 5 }) => {
  const pct = (value / max) * 100;
  const barColor =
    pct > 80 ? '#10b981' : pct > 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 12,
          marginBottom: 4,
        }}
      >
        <span style={{ color: '#6b7280' }}>{label}</span>
        <span style={{ fontWeight: 600 }}>{value.toFixed(1)}</span>
      </div>
      <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3 }}>
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: barColor,
            width: `${pct}%`,
            transition: 'width 0.5s',
          }}
        />
      </div>
    </div>
  );
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
  valueColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  valueColor = '#111827',
}) => (
  <div
    style={{
      background: '#f8fafc',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: '14px 18px',
      flex: 1,
    }}
  >
    <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, letterSpacing: 0.5 }}>
      {icon && `${icon} `}{label}
    </div>
    <div
      style={{ fontSize: 20, fontWeight: 700, color: valueColor, marginTop: 4 }}
    >
      {value}
    </div>
  </div>
);

// ─── SectionCard ─────────────────────────────────────────────────────────────
interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, children, style }) => (
  <div
    style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 14,
      padding: 20,
      ...style,
    }}
  >
    <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#111827' }}>
      {title}
    </h3>
    {children}
  </div>
);

// ─── BackButton ───────────────────────────────────────────────────────────────
interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = 'Back',
}) => (
  <button
    onClick={onClick}
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
    }}
  >
    ← {label}
  </button>
);

// ─── EmptyState ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  emoji = '🔍',
  title,
  subtitle,
  actionLabel,
  onAction,
}) => (
  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
    <div style={{ fontSize: 52, marginBottom: 12 }}>{emoji}</div>
    <div style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>{title}</div>
    {subtitle && (
      <div style={{ fontSize: 13, marginTop: 6, color: '#9ca3af' }}>{subtitle}</div>
    )}
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        style={{
          marginTop: 20,
          padding: '10px 28px',
          borderRadius: 10,
          border: 'none',
          background: '#3b82f6',
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        {actionLabel}
      </button>
    )}
  </div>
);