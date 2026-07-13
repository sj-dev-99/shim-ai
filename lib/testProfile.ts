export type TestGender = "female" | "male";

export type TestProfile = {
  nickname: string;
  gender?: TestGender;
};

export const ANONYMOUS_NICKNAME = "익명";
const TEST_PROFILE_KEY = "shim_ai_test_profile";

function isStorageAvailable() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function readTestProfile(): TestProfile | null {
  if (!isStorageAvailable()) return null;

  try {
    const raw = window.localStorage.getItem(TEST_PROFILE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<TestProfile>;
    if (typeof parsed.nickname !== "string" || !parsed.nickname.trim()) return null;

    return {
      nickname: parsed.nickname.trim(),
      gender: parsed.gender === "female" || parsed.gender === "male" ? parsed.gender : undefined
    };
  } catch {
    return null;
  }
}

export function saveTestProfile(profile: TestProfile) {
  if (!isStorageAvailable()) return;

  const nickname = profile.nickname.trim() || ANONYMOUS_NICKNAME;

  window.localStorage.setItem(
    TEST_PROFILE_KEY,
    JSON.stringify({
      nickname,
      gender: profile.gender
    })
  );
}
