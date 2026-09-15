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

export async function fetchTarotDeck() {
  const res = await fetch(`${API_BASE}/tarot`)
  if (!res.ok) throw new Error('Failed to fetch tarot deck')
  return res.json()
}

export async function drawTarotCard() {
  const res = await fetch(`${API_BASE}/tarot/draw`)
  if (!res.ok) throw new Error('Failed to draw tarot card')
  return res.json()
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
