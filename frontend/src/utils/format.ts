// ─── Formatting Utilities ─────────────────────────────────────────────────────

/**
 * Format money into compact Indian notation
 * Example:
 * 1800000  -> ₹18.0L
 * 10000000 -> ₹1.0Cr
 */
export const formatMoney = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }

  return `₹${amount}`;
};

/**
 * Format yearly college fees
 * Example:
 * 220000 -> ₹2.2L/yr
 */
export const formatFees = (fees: number): string => {
  if (fees >= 100000) {
    return `₹${(fees / 100000).toFixed(1)}L/yr`;
  }

  if (fees >= 1000) {
    return `₹${(fees / 1000).toFixed(0)}K/yr`;
  }

  return `₹${fees}/yr`;
};

/**
 * Convert rating into star string
 * Example:
 * 4 -> ★★★★☆
 */
export const starString = (rating: number): string => {
  const filledStars = Math.round(rating);
  const emptyStars = 5 - filledStars;

  return '★'.repeat(filledStars) + '☆'.repeat(emptyStars);
};

/**
 * Clamp a value between min and max
 */
export const clamp = (
  value: number,
  min: number,
  max: number
): number => {
  return Math.min(Math.max(value, min), max);
};