export type ReviewInviteContact = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  consent: boolean;
};

const STORAGE_KEY = "review_invites_v1";

type InviteMap = Record<string, { contact: ReviewInviteContact; savedAt: string }>;

function safeParse(json: string | null): InviteMap {
  if (!json) return {};
  try {
    const parsed = JSON.parse(json) as InviteMap;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

export function saveReviewInvite(token: string, contact: ReviewInviteContact) {
  if (typeof window === "undefined") return;
  const existing = safeParse(window.localStorage.getItem(STORAGE_KEY));
  existing[token] = { contact, savedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getReviewInvite(token: string): ReviewInviteContact | null {
  if (typeof window === "undefined") return null;
  const existing = safeParse(window.localStorage.getItem(STORAGE_KEY));
  return existing[token]?.contact ?? null;
}

