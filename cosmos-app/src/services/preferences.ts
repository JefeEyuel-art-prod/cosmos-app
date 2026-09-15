// Local storage persistence for user selections, so the UI keeps its
// state across a page refresh. Wrapped in try/catch since localStorage can
// throw in restrictive browser contexts (private mode, disabled storage).

const STORAGE_KEY = 'cosmos-app:preferences:v1'

export interface PersistedPreferences {
  selectedDeckId?: string
  selectedZodiacName?: string | null
  birthDate?: string
  birthTime?: string
  utcOffsetHours?: number
  latitude?: number
  longitude?: number
  name?: string
}

export function loadPreferences(): PersistedPreferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as PersistedPreferences
  } catch {
    return {}
  }
}

export function savePreferences(update: Partial<PersistedPreferences>): void {
  try {
    const current = loadPreferences()
    const next = { ...current, ...update }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Ignore storage errors (private mode, quota exceeded, etc).
  }
}
