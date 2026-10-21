// API service layer
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function fetchTransits() {
  const res = await fetch(`${API_BASE}/transits`)
  if (!res.ok) throw new Error('Failed to fetch transits')
  return res.json()
}

export async function fetchTransitByPlanet(planet: string) {
  const res = await fetch(`${API_BASE}/transits/${planet}`)
  if (!res.ok) throw new Error('Failed to fetch transit')
  return res.json()
}

export interface TarotCard {
  symbol: string
  title: string
  energy: string
  theme: string
  shadow: string
  question: string
  action: string
}

export interface TarotDeck {
  id: string
  name: string
  description: string
  cards: TarotCard[]
}

export async function fetchTarotDecks(): Promise<TarotDeck[]> {
  const res = await fetch(`${API_BASE}/tarot`)
  if (!res.ok) throw new Error('Failed to fetch tarot decks')
  const json = await res.json()
  return json.data
}

export async function drawTarotCard(deckId: string, count = 1): Promise<{ deckId: string; deckName: string; card: TarotCard; cards: TarotCard[] }> {
  const res = await fetch(`${API_BASE}/tarot/draw?deck=${encodeURIComponent(deckId)}&count=${count}`)
  if (!res.ok) throw new Error('Failed to draw tarot card')
  const json = await res.json()
  return json.data
}

export async function fetchAstroEvents() {
  const res = await fetch(`${API_BASE}/events`)
  if (!res.ok) throw new Error('Failed to fetch events')
  return res.json()
}

export async function fetchTrueBomb() {
  const res = await fetch(`${API_BASE}/bomb`)
  if (!res.ok) throw new Error('Failed to fetch bomb')
  return res.json()
}

export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`)
  if (!res.ok) throw new Error('API is down')
  return res.json()
}

// --- Reading persistence -----------------------------------------------

export interface ReadingPayload {
  name?: string
  birthDate?: string
  birthTime?: string
  sunSign?: string
  moonSign?: string
  risingSign?: string
  deckId?: string
  deckName?: string
  card?: string
  transitPlanet?: string
  spreadSize?: number
  spreadCards?: string[]
  spreadPositions?: string[]
  priorReadingCount?: number
  cosmicDate?: string
  cosmicImpact?: string
  readingText: string
}

export interface SavedReading extends ReadingPayload {
  id: string
  createdAt: string
}

export async function saveReading(payload: ReadingPayload): Promise<SavedReading> {
  const res = await fetch(`${API_BASE}/readings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to save reading')
  const json = await res.json()
  return json.data
}

export async function fetchReading(id: string): Promise<SavedReading> {
  const res = await fetch(`${API_BASE}/readings/${id}`)
  if (!res.ok) throw new Error('Reading not found')
  const json = await res.json()
  return json.data
}

export async function fetchRecentReadings(limit = 20): Promise<SavedReading[]> {
  const res = await fetch(`${API_BASE}/readings?limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch readings')
  const json = await res.json()
  return json.data
}

export interface Transit {
  symbol: string
  planet: string
  archetype: string
  myth: string
  day: string
  dimension: string
  note: string
}

export interface DailyCosmicForecast {
  date: string
  timeZone: string
  alignment: string
  status: string
  retrograde: string
  focus: string
  collective: string
  impact: string
}

export interface CosmicEvent {
  date: string
  label: string
  kind: string
  description: string
}

export async function fetchDailyCosmicForecast(chart: { sunSign?: string; moonSign?: string; risingSign?: string }): Promise<DailyCosmicForecast> {
  const params = new URLSearchParams({ timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
  for (const [key, value] of Object.entries(chart)) if (value) params.set(key, value)
  const res = await fetch(`${API_BASE}/cosmic/today?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch daily cosmic forecast')
  const json = await res.json()
  return json.data
}

export async function fetchCosmicCalendar(): Promise<CosmicEvent[]> {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const res = await fetch(`${API_BASE}/cosmic/calendar?timeZone=${encodeURIComponent(timeZone)}`)
  if (!res.ok) throw new Error('Failed to fetch cosmic calendar')
  const json = await res.json()
  return json.data
}

export async function fetchTransitData(): Promise<Transit[]> {
  const res = await fetch(`${API_BASE}/transits`)
  if (!res.ok) throw new Error('Failed to fetch transits')
  const json = await res.json()
  return json.data
}
