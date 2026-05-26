import React from 'react';
import type { Page } from '../types';

interface NavItem {
  id: Page;
  label: string;
  icon: string;
}

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  compareCount: number;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, compareCount }) => {
  const navItems: NavItem[] = [
    { id: 'listing',   label: 'Colleges',  icon: '🏫' },
    { id: 'compare',   label: `Compare${compareCount > 0 ? ` (${compareCount})` : ''}`, icon: '⚖️' },
    { id: 'predictor', label: 'Predictor', icon: '🎯' },
  ];

  return (
    <header
      style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          height: 60,
          gap: 32,
        }}
      >
        {/* Brand */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => onNavigate('listing')}
          role="button"
          aria-label="Go to home"
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17,
            }}
          >
            🎓
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: 19,
              color: '#111827',
              fontFamily: 'Georgia, serif',
              letterSpacing: -0.5,
            }}
          >
            CampusIQ
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 4, flex: 1 }}>
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#1d4ed8' : '#6b7280',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {item.icon} {item.label}
              </button>
            );
          })}
        </nav>

        <span style={{ fontSize: 13, color: '#9ca3af', whiteSpace: 'nowrap' }}>
          India's College Discovery
        </span>
      </div>
    </header>
  );
};

export default Header;