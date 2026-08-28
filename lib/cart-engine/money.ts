/**
 * All cart math happens in integer cents. Summing floating-point dollars
 * (0.1 + 0.2 territory) drifts by fractions of a cent across enough line
 * items; summing cents doesn't, because every value is a whole number.
 */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}
