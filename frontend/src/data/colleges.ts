import type {
  College,
  CollegeType,
  Tier,
  ExamName,
} from '../types';

// ─── College Dataset ──────────────────────────────────────────────────────────

export const COLLEGES: College[] = [
  {
    id: 1,
    name: 'IIT Bombay',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'Engineering',
    tier: 'Tier 1',
    fees: 220000,
    rating: 4.8,
    placements: {
      avg: 1800000,
      highest: 6500000,
      rate: 96,
    },
    courses: [
      'B.Tech CS',
      'B.Tech EE',
      'B.Tech ME',
      'M.Tech',
      'PhD',
    ],
    estd: 1958,
    seats: 880,
    intake: 'JEE Advanced',
    cutoff: 50,
    logo: 'IB',
    color: '#1a3a6b',
    reviews: 4280,
    accreditation: 'NBA/NAAC A++',
  },

  {
    id: 2,
    name: 'IIT Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    type: 'Engineering',
    tier: 'Tier 1',
    fees: 215000,
    rating: 4.7,
    placements: {
      avg: 1700000,
      highest: 6200000,
      rate: 95,
    },
    courses: [
      'B.Tech CS',
      'B.Tech Civil',
      'B.Tech Chemical',
      'M.Tech',
      'MBA',
    ],
    estd: 1961,
    seats: 850,
    intake: 'JEE Advanced',
    cutoff: 100,
    logo: 'ID',
    color: '#8b1a1a',
    reviews: 3920,
    accreditation: 'NBA/NAAC A++',
  },

  {
    id: 3,
    name: 'NIT Trichy',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    type: 'Engineering',
    tier: 'Tier 1',
    fees: 145000,
    rating: 4.5,
    placements: {
      avg: 900000,
      highest: 3500000,
      rate: 88,
    },
    courses: [
      'B.Tech CS',
      'B.Tech ECE',
      'B.Tech Mech',
      'M.Tech',
    ],
    estd: 1964,
    seats: 1200,
    intake: 'JEE Mains',
    cutoff: 2000,
    logo: 'NT',
    color: '#1a5c1a',
    reviews: 2100,
    accreditation: 'NBA/NAAC A+',
  },

  {
    id: 4,
    name: 'BITS Pilani',
    city: 'Pilani',
    state: 'Rajasthan',
    type: 'Engineering',
    tier: 'Tier 1',
    fees: 480000,
    rating: 4.6,
    placements: {
      avg: 1200000,
      highest: 4500000,
      rate: 92,
    },
    courses: [
      'B.E. CS',
      'B.E. EEE',
      'B.Pharm',
      'M.E.',
      'MBA',
    ],
    estd: 1964,
    seats: 700,
    intake: 'BITSAT',
    cutoff: 320,
    logo: 'BP',
    color: '#4a1a6b',
    reviews: 2850,
    accreditation: 'NAAC A',
  },

  {
    id: 5,
    name: 'VIT Vellore',
    city: 'Vellore',
    state: 'Tamil Nadu',
    type: 'Engineering',
    tier: 'Tier 2',
    fees: 198000,
    rating: 4.1,
    placements: {
      avg: 680000,
      highest: 2800000,
      rate: 82,
    },
    courses: [
      'B.Tech CS',
      'B.Tech ECE',
      'B.Tech Mech',
      'MBA',
      'M.Tech',
    ],
    estd: 1984,
    seats: 6000,
    intake: 'VITEEE',
    cutoff: 50000,
    logo: 'VT',
    color: '#c46a00',
    reviews: 5100,
    accreditation: 'NAAC A++',
  },
];

// ─── Filter Options ───────────────────────────────────────────────────────────

export const STATES: string[] = [
  ...new Set(COLLEGES.map((college) => college.state)),
].sort();

export const TYPES: CollegeType[] = [
  ...new Set(COLLEGES.map((college) => college.type)),
].sort();

export const TIERS: Tier[] = [
  'Tier 1',
  'Tier 2',
  'Tier 3',
];

// ─── Exam Options ─────────────────────────────────────────────────────────────

export const EXAM_OPTIONS: {
  name: ExamName;
  types: CollegeType[];
}[] = [
  {
    name: 'JEE Advanced',
    types: ['Engineering'],
  },

  {
    name: 'JEE Mains',
    types: ['Engineering'],
  },

  {
    name: 'CAT',
    types: ['Management'],
  },

  {
    name: 'NEET',
    types: ['Medical'],
  },

  {
    name: 'CUET',
    types: ['Arts & Science'],
  },

  {
    name: 'BITSAT',
    types: ['Engineering'],
  },

  {
    name: 'VITEEE',
    types: ['Engineering'],
  },

  {
    name: 'SRMJEEE',
    types: ['Engineering'],
  },

  {
    name: 'MET',
    types: ['Engineering'],
  },

  {
    name: 'TNEA',
    types: ['Engineering'],
  },
];