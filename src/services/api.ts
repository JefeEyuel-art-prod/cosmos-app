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
