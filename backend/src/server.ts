import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Crash & Failure Probability Control
const CRASH_PROBABILITY = parseFloat(process.env.CRASH_PROBABILITY || '0') // 0-1 scale
const FAILURE_PROBABILITY = parseFloat(process.env.FAILURE_PROBABILITY || '0') // 0-1 scale
const MAX_CONSECUTIVE_FAILURES = parseInt(process.env.MAX_FAILURES || '5')

let consecutiveFailures = 0
let shouldCrash = false

// Controlled crash endpoint
const checkCrash = () => {
  if (shouldCrash || Math.random() < CRASH_PROBABILITY) {
    shouldCrash = true
    console.error('💥 CRASH TRIGGERED: Server will terminate in 2 seconds')
    setTimeout(() => process.exit(1), 2000)
  }
}

// Controlled failure injection
const checkFailure = () => {
  if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
    console.warn(`⚠️ Max consecutive failures (${MAX_CONSECUTIVE_FAILURES}) reached, allowing response`)
    return false
  }
  if (Math.random() < FAILURE_PROBABILITY) {
    consecutiveFailures++
    return true
  }
  consecutiveFailures = 0
  return false
}

// Middleware to check for crashes
app.use((req: Request, res: Response, next) => {
  checkCrash()
  next()
})

app.use(cors())
app.use(express.json())

// Data layer
const transitLog = [
  {
    symbol: '☿',
    planet: 'Mercury',
    archetype: 'Messenger',
    myth: 'Hermes',
    day: 'Wednesday',
    dimension: 'Mind / Technology',
    note: 'Communication is quick, clever, and ready to reshape thoughts with language and technology.',
  },
  {
    symbol: '♀',
    planet: 'Venus',
    archetype: 'Lover',
    myth: 'Aphrodite',
    day: 'Friday',
    dimension: 'Relationships / Value',
    note: 'Relationships, beauty, and shared worth move toward harmony and soulful resonance.',
  },
  {
    symbol: '⊕',
    planet: 'Earth',
    archetype: 'Grounder',
    myth: 'Gaia',
    day: 'Saturday',
    dimension: 'Body / Reality',
    note: 'Presence, care, and the body are the portal for translating cosmic input into practical action.',
  },
  {
    symbol: '⊙',
    planet: 'Sun',
    archetype: 'Self',
    myth: 'Apollo',
    day: 'Sunday',
    dimension: 'Will / Purpose',
    note: 'Creative purpose and radiant will are highlighted; the story of who you are is in the light.',
  },
  {
    symbol: '☾',
    planet: 'Moon',
    archetype: 'Soul',
    myth: 'Selene',
    day: 'Monday',
    dimension: 'Emotion / Intuition',
    note: 'Emotions, intuition, and the inner world are amplified; personal rhythms matter now.',
  },
  {
    symbol: '♄',
    planet: 'Saturn',
    archetype: 'Sage',
    myth: 'Cronus',
    day: 'Saturday',
    dimension: 'Discipline / Form',
    note: 'Structure, ritual, and boundaries ask for discipline so creation has lasting form.',
  },
]

const tarotDeck = [
  { symbol: '0', title: 'The Fool', energy: 'Fresh beginnings, trust in the journey, bold initiation.' },
  { symbol: 'I', title: 'The Magician', energy: 'Manifestation, clever resourcefulness, channeling creative power.' },
  { symbol: 'II', title: 'The High Priestess', energy: 'Inner knowing, subtle intuition, sacred mystery.' },
  { symbol: 'III', title: 'The Empress', energy: 'Nurturing abundance, fertile creativity, embodied grace.' },
  { symbol: 'IV', title: 'The Emperor', energy: 'Authority, structure, stable leadership, protective strength.' },
  { symbol: 'VI', title: 'The Lovers', energy: 'Soulful choice, alignment, conscious relationship.' },
  { symbol: 'VII', title: 'The Chariot', energy: 'Focused action, momentum, courageous direction.' },
  { symbol: 'VIII', title: 'Strength', energy: 'Gentle power, inner resilience, compassionate courage.' },
  { symbol: 'IX', title: 'The Hermit', energy: 'Wise reflection, restful clarity, personal truth.' },
  { symbol: 'XVII', title: 'The Star', energy: 'Hope renewed, spiritual vision, calming inspiration.' },
]

const trueBombs = [
  "Every star you notice is a mirror of the choice you're ready to make.",
  "Cosmologie says you are not lost; you are orbiting toward a deeper point of view.",
  "Astrology reveals patterns, but only your attention turns them into action.",
  "A true bomb lands when presence meets a question.",
  "The universe whispers through symbols; you translate them by staying present.",
]

const astroEvents = [
  { name: 'Lunar Eclipse', hint: 'Shift your focus; hidden intentions become vivid under the shadow.' },
  { name: 'Meteor Shower', hint: 'A rush of inspiration lands from unexpected directions.' },
  { name: 'Supernova Pulse', hint: 'A powerful burst of clarity reshapes your inner landscape.' },
  { name: 'Zodiac Gate', hint: "The soul's pattern is aligning with fresh meaning." },
  { name: 'Solar Wind', hint: 'Soft momentum carries truth across a quiet distance.' },
]

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  if (checkFailure()) {
    return res.status(503).json({ status: 'Service temporarily unavailable', timestamp: new Date().toISOString() })
  }
  res.json({ 
    status: 'Cosmos API is alive', 
    timestamp: new Date().toISOString(),
    crashProbability: CRASH_PROBABILITY,
    failureProbability: FAILURE_PROBABILITY,
    consecutiveFailures
  })
})

app.get('/api/transits', (req: Request, res: Response) => {
  if (checkFailure()) {
    return res.status(503).json({ error: 'Service temporarily unavailable' })
  }
  res.json({ data: transitLog })
})

app.get('/api/transits/:planet', (req: Request, res: Response) => {
  if (checkFailure()) {
    return res.status(503).json({ error: 'Service temporarily unavailable' })
  }
  const transit = transitLog.find((t) => t.planet.toLowerCase() === req.params.planet.toLowerCase())
  if (!transit) {
    return res.status(404).json({ error: 'Transit not found' })
  }
  res.json({ data: transit })
})

app.get('/api/tarot', (req: Request, res: Response) => {
  if (checkFailure()) {
    return res.status(503).json({ error: 'Service temporarily unavailable' })
  }
  res.json({ data: tarotDeck })
})

app.get('/api/tarot/draw', (req: Request, res: Response) => {
  if (checkFailure()) {
    return res.status(503).json({ error: 'Service temporarily unavailable' })
  }
  const card = tarotDeck[Math.floor(Math.random() * tarotDeck.length)]
  res.json({ data: card })
})

app.get('/api/events', (req: Request, res: Response) => {
  if (checkFailure()) {
    return res.status(503).json({ error: 'Service temporarily unavailable' })
  }
  res.json({ data: astroEvents })
})

app.get('/api/bomb', (req: Request, res: Response) => {
  if (checkFailure()) {
    return res.status(503).json({ error: 'Service temporarily unavailable' })
  }
  const bomb = trueBombs[Math.floor(Math.random() * trueBombs.length)]
  res.json({ data: bomb })
})

// Config endpoint
app.get('/api/config', (req: Request, res: Response) => {
  res.json({
    crashProbability: CRASH_PROBABILITY,
    failureProbability: FAILURE_PROBABILITY,
    maxConsecutiveFailures: MAX_CONSECUTIVE_FAILURES,
    currentConsecutiveFailures: consecutiveFailures
  })
})

app.listen(PORT, () => {
  console.log(`🌌 Cosmos API running on http://localhost:${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
})

export default app
