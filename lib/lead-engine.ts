export type InquiryForScoring = {
  type: string;
  guestCount?: number | null;
  charterDurationWeeks?: number | null;
  preferredMonth?: string | null;
  routePreference?: string | null;
  boatPreference?: string | null;
  notes?: string | null;
};

export function calculateLeadScore(i: InquiryForScoring) {
  let score = 0;

  if (i.type === "CHARTER") score += 30;
  else score += 10;

  if (i.guestCount && i.guestCount >= 6) score += 20;
  else if (i.guestCount && i.guestCount >= 4) score += 10;

  if (i.charterDurationWeeks && i.charterDurationWeeks >= 2) score += 25;
  else if (i.charterDurationWeeks === 1) score += 10;

  if (i.boatPreference) score += 15;
  if (i.routePreference) score += 10;

  if (i.notes && i.notes.trim().length > 20) score += 10;

  return Math.min(score, 100);
}

export function calculateEstimatedValue(i: InquiryForScoring) {
  if (i.type === "TRAINING") {
    return 500;
  }

  const baseWeekly = 5000;
  const weeks = i.charterDurationWeeks || 1;
  const guestFactor = i.guestCount ? i.guestCount / 4 : 1;

  return Math.round(baseWeekly * weeks * guestFactor);
}