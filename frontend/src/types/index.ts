// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface PlacementStats {
  avg: number;
  highest: number;
  rate: number;
  _id?: string; // MongoDB adds this to nested objects
}

export type CollegeType =
  | 'Engineering'
  | 'Management'
  | 'Medical'
  | 'Arts & Science';

export type Tier =
  | 'Tier 1'
  | 'Tier 2'
  | 'Tier 3';

export type ExamName =
  | 'JEE Advanced'
  | 'JEE Mains'
  | 'CAT'
  | 'NEET'
  | 'CUET'
  | 'BITSAT'
  | 'VITEEE'
  | 'SRMJEEE'
  | 'MET'
  | 'TNEA'
  | 'AEEE';   // added — Amrita uses AEEE

export type Category =
  | 'General'
  | 'OBC'
  | 'SC'
  | 'ST'
  | 'EWS';

export type SortOption =
  | 'rating'
  | 'fees_asc'
  | 'fees_desc'
  | 'placement';

export interface College {
  _id?: string;       // ← ADDED — MongoDB's actual document ID
  id: number;        // your custom numeric id
  name: string;
  city: string;
  state: string;
  type: CollegeType;
  tier: Tier;
  fees: number;
  rating: number;
  placements: PlacementStats;
  courses: string[];
  estd: number;
  seats: number;
  intake: string;    // ← changed from ExamName to string (handles any new exam values safely)
  cutoff: number;
  logo: string;
  color: string;
  reviews: number;
  accreditation: string;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface CollegeFilters {
  state: string;
  type: string;
  tier: string;
  maxFees: number;
  minRating: number;
}

// ─── Predictor Types ──────────────────────────────────────────────────────────

export interface PredictorResult {
  college: College;
  chance: 'High' | 'Medium' | 'Low';
}

// ─── Navigation Types ─────────────────────────────────────────────────────────

export type Page =
  | 'listing'
  | 'detail'
  | 'compare'
  | 'predictor';