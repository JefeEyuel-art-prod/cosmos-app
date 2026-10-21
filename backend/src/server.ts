import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { randomUUID } from 'crypto'
import * as Astronomy from 'astronomy-engine'
import pg from 'pg'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const { Pool } = pg
const databaseUrl = process.env.DATABASE_URL
const pool = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null

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

const tarotDecks = [
  {
    id: 'classic',
    name: 'Classic Arcana',
    description: 'Foundational archetypes for everyday clarity.',
    cards: [
      { symbol: '0', title: 'The Fool', energy: 'Fresh beginnings', theme: 'Begin without pretending certainty.', shadow: 'Impulsiveness or avoiding responsibility.', question: 'What first step can you take before you know the whole path?', action: 'Name one reversible experiment and take it today.' },
      { symbol: 'I', title: 'The Magician', energy: 'Resourceful manifestation', theme: 'Your tools become powerful when you focus them.', shadow: 'Scattered effort or performance without substance.', question: 'Which resource are you underusing?', action: 'Choose one tool, one outcome, and one concrete next move.' },
      { symbol: 'II', title: 'The High Priestess', energy: 'Inner knowing', theme: 'Meaning is emerging through patience and observation.', shadow: 'Withholding, secrecy, or mistaking anxiety for intuition.', question: 'What do you already know but keep postponing?', action: 'Create ten quiet minutes and write what remains true.' },
      { symbol: 'III', title: 'The Empress', energy: 'Nurturing abundance', theme: 'Growth needs attention, embodiment, and care.', shadow: 'Overgiving or confusing comfort with progress.', question: 'What deserves consistent nourishment?', action: 'Give one important project a small, repeatable care ritual.' },
      { symbol: 'IV', title: 'The Emperor', energy: 'Structure and authority', theme: 'Clear boundaries turn intention into stability.', shadow: 'Control, rigidity, or leadership without listening.', question: 'Where would a useful boundary create freedom?', action: 'Define the rule, owner, and next checkpoint.' },
      { symbol: 'VI', title: 'The Lovers', energy: 'Aligned choice', theme: 'Alignment is demonstrated by the choice you enact.', shadow: 'Indecision or outsourcing your values.', question: 'Which option matches the person you want to become?', action: 'List your top value and make one decision that protects it.' },
      { symbol: 'VII', title: 'The Chariot', energy: 'Directed momentum', theme: 'Progress comes from coordinating competing drives.', shadow: 'Forcing speed or winning the wrong goal.', question: 'What deserves your direction rather than your reaction?', action: 'Remove one distraction and schedule a focused sprint.' },
      { symbol: 'VIII', title: 'Strength', energy: 'Compassionate courage', theme: 'Steady attention can transform intensity.', shadow: 'Suppression, passivity, or proving toughness.', question: 'What could soften without becoming weaker?', action: 'Respond to one difficult moment with patience and a boundary.' },
      { symbol: 'IX', title: 'The Hermit', energy: 'Deliberate reflection', theme: 'Distance reveals the signal beneath the noise.', shadow: 'Isolation or endless preparation.', question: 'What answer needs solitude, not more input?', action: 'Take a short technology-free walk and return with one conclusion.' },
      { symbol: 'XVII', title: 'The Star', energy: 'Renewed hope', theme: 'Hope becomes useful when it guides consistent action.', shadow: 'Idealism without repair or follow-through.', question: 'What future is worth tending even slowly?', action: 'Choose one small act that proves your hope is active.' },
    ],
  },
  {
    id: 'lunar',
    name: 'Lunar Shadow Deck',
    description: 'Moon-phase prompts for reflective shadow work.',
    cards: [
      { symbol: '🌑', title: 'New Moon Seed', energy: 'Invisible beginnings', theme: 'A quiet intention is forming before it has visible evidence.', shadow: 'Demanding proof too early.', question: 'What would you begin if nobody needed to see it yet?', action: 'Write the intention and protect its first small step.' },
      { symbol: '🌕', title: 'Full Moon Mirror', energy: 'Illumination', theme: 'Visibility makes an honest response possible.', shadow: 'Drama, exposure, or reacting before integrating.', question: 'What is asking to be acknowledged?', action: 'State the fact, feeling, and choice separately.' },
      { symbol: '☍', title: 'Eclipse Reveal', energy: 'Confrontation with truth', theme: 'A disruption can expose the pattern that normal routines hide.', shadow: 'Catastrophizing or surrendering agency.', question: 'What changed, and what remains yours to choose?', action: 'Separate the uncontrollable event from your next controllable act.' },
      { symbol: '✧', title: 'Dream Threshold', energy: 'Symbolic guidance', theme: 'Imagination can surface a perspective analysis misses.', shadow: 'Escaping into symbolism instead of acting.', question: 'What practical message is hidden in the image?', action: 'Translate one symbol into a measurable behavior.' },
    ],
  },
  {
    id: 'solar',
    name: 'Solar Flame Deck',
    description: 'Action-oriented prompts for momentum and commitment.',
    cards: [
      { symbol: '☀', title: 'Dawn Spark', energy: 'First resolve', theme: 'Momentum starts when intention receives a time and place.', shadow: 'Waiting for perfect motivation.', question: 'What can begin in the next fifteen minutes?', action: 'Start a timed first pass before evaluating it.' },
      { symbol: '🔥', title: 'Solar Flare', energy: 'Radiant disruption', theme: 'A burst of energy can clear a blocked path.', shadow: 'Burnout or collateral damage.', question: 'What needs decisive energy, and what needs protection?', action: 'Make the bold move with one explicit safety limit.' },
      { symbol: '🜂', title: 'Phoenix Ash', energy: 'Regeneration', theme: 'Release creates room for a more honest form.', shadow: 'Repeating the old pattern under a new name.', question: 'What are you finished carrying?', action: 'Close one loop and record what you learned from it.' },
      { symbol: '★', title: 'Zenith Light', energy: 'Peak clarity', theme: 'Purpose becomes visible when competing priorities fall away.', shadow: 'Ego, perfectionism, or fear of decline.', question: 'What matters if applause disappears?', action: 'Commit to the priority and define its next deliverable.' },
    ],
  },
]

const tarotDeck = tarotDecks[0].cards

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

const dailyCosmicThemes = [
  { alignment: 'Mercury trine Saturn', status: 'Direct', focus: 'Clear thinking becomes easier when ideas receive structure.', collective: 'Communities may favor practical plans over fast reactions.' },
  { alignment: 'Venus opposite Mars', status: 'Direct', focus: 'Desire and boundaries ask to be negotiated rather than dramatized.', collective: 'Collective attention may swing between connection and independence.' },
  { alignment: 'Mars square Uranus', status: 'Volatile', focus: 'Urgency can reveal where a stale system needs redesign.', collective: 'Groups may experience restless pressure for change.' },
  { alignment: 'Jupiter sextile Neptune', status: 'Reflective', focus: 'Hope expands when imagination is paired with discernment.', collective: 'Shared visions can inspire care, but need grounded language.' },
  { alignment: 'Sun conjunct Moon', status: 'Renewing', focus: 'Intentions and emotional needs can be brought into one honest starting point.', collective: 'Collective consciousness may seek a reset and a simpler story.' },
]

function localDateForTimeZone(timeZone = 'UTC') {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

function planetarySnapshot(date: Date) {
  const bodies = [Astronomy.Body.Mercury, Astronomy.Body.Venus, Astronomy.Body.Mars, Astronomy.Body.Jupiter, Astronomy.Body.Saturn]
  return bodies.map((body) => ({ body: Astronomy.Body[body], longitude: Astronomy.EclipticLongitude(body, date) }))
}

function dailyCosmicForecast(sunSign?: string, moonSign?: string, risingSign?: string, timeZone = 'UTC') {
  const date = localDateForTimeZone(timeZone)
  const instant = new Date(`${date}T12:00:00Z`)
  const dayNumber = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400000)
  const theme = dailyCosmicThemes[((dayNumber % dailyCosmicThemes.length) + dailyCosmicThemes.length) % dailyCosmicThemes.length]
  const positions = planetarySnapshot(instant)
  const motionTomorrow = planetarySnapshot(new Date(instant.getTime() + 86400000))
  const retrogradeBody = positions.find((position, index) => motionTomorrow[index].longitude < position.longitude)
  const retrograde = retrogradeBody ? `${retrogradeBody.body} appears retrograde in geocentric longitude` : 'No featured retrograde today'
  const alignment = `${theme.alignment} · ${positions[0].body} ${positions[0].longitude.toFixed(1)}°`
  const chartLens = [sunSign, moonSign, risingSign].filter(Boolean)
  const impact = chartLens.length
    ? `Your ${chartLens.join(', ')} chart lens meets this sky through ${theme.focus.toLowerCase()} ${moonSign ? `Your Moon in ${moonSign} colors the emotional response, while ${risingSign || 'your Rising sign'} describes the outward adjustment.` : 'Add Moon and Rising signs for more emotional and behavioral detail.'}`
    : 'Add your birth date, time, and location to translate this collective weather into a personal chart impact.'
  return { date, timeZone, alignment, status: theme.status, retrograde, focus: theme.focus, collective: theme.collective, impact, positions }
}

function upcomingCosmicEvents(timeZone = 'UTC') {
  const start = new Date()
  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(start.getTime() + index * 86400000)
    const forecast = dailyCosmicForecast(undefined, undefined, undefined, timeZone)
    const theme = dailyCosmicThemes[index % dailyCosmicThemes.length]
    return { date: date.toISOString().slice(0, 10), label: index === 0 ? 'Today' : theme.alignment, kind: index % 4 === 0 ? 'Alignment' : index % 5 === 0 ? 'Retrograde watch' : 'Collective weather', description: index === 0 ? forecast.focus : theme.collective }
  })
}

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
  const deckId = typeof req.query.deck === 'string' ? req.query.deck : undefined
  const decks = deckId ? tarotDecks.filter((deck) => deck.id === deckId) : tarotDecks
  if (deckId && decks.length === 0) return res.status(404).json({ error: 'Tarot deck not found' })
  res.json({ data: decks })
})

app.get('/api/tarot/draw', (req: Request, res: Response) => {
  if (checkFailure()) {
    return res.status(503).json({ error: 'Service temporarily unavailable' })
  }
  const deckId = typeof req.query.deck === 'string' ? req.query.deck : undefined
  const deck = tarotDecks.find((candidate) => candidate.id === deckId) ?? tarotDecks[0]
  const requestedCount = Number(req.query.count || 1)
  const count = [1, 3, 5, 9].includes(requestedCount) ? requestedCount : 1
  const shuffled = [...deck.cards].sort(() => Math.random() - 0.5)
  const cards = Array.from({ length: count }, (_, index) => shuffled[index % shuffled.length])
  res.json({ data: { deckId: deck.id, deckName: deck.name, cards, card: cards[0] } })
})

app.get('/api/cosmic/today', (req: Request, res: Response) => {
  if (checkFailure()) {
    return res.status(503).json({ error: 'Service temporarily unavailable' })
  }
  res.json({ data: dailyCosmicForecast(
    typeof req.query.sunSign === 'string' ? req.query.sunSign : undefined,
    typeof req.query.moonSign === 'string' ? req.query.moonSign : undefined,
    typeof req.query.risingSign === 'string' ? req.query.risingSign : undefined,
    typeof req.query.timeZone === 'string' ? req.query.timeZone : 'UTC',
  ) })
})

app.get('/api/cosmic/calendar', (req: Request, res: Response) => {
  res.json({ data: upcomingCosmicEvents(typeof req.query.timeZone === 'string' ? req.query.timeZone : 'UTC') })
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

// --- Reading persistence (in-memory) ---------------------------------------
// Readings are kept in memory for this demo API. They reset on server
// restart. Capped at MAX_READINGS so the process can't grow unbounded.
interface Reading {
  id: string
  createdAt: string
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
  spreadSize?: number
  spreadCards?: string[]
  spreadPositions?: string[]
  priorReadingCount?: number
  cosmicDate?: string
  cosmicImpact?: string
}

const readings: Reading[] = []
const MAX_READINGS = 500

function mapReading(row: any): Reading {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    birthDate: row.birth_date,
    birthTime: row.birth_time,
    sunSign: row.sun_sign,
    moonSign: row.moon_sign,
    risingSign: row.rising_sign,
    deckId: row.deck_id,
    deckName: row.deck_name,
    card: row.card,
    transitPlanet: row.transit_planet,
    spreadSize: row.spread_size,
    spreadCards: row.spread_cards,
    spreadPositions: row.spread_positions,
    priorReadingCount: row.prior_reading_count,
    cosmicDate: row.cosmic_date,
    cosmicImpact: row.cosmic_impact,
    readingText: row.reading_text,
  }
}

app.post('/api/readings', async (req: Request, res: Response) => {
  const body = req.body || {}
  if (!body.readingText || typeof body.readingText !== 'string') {
    return res.status(400).json({ error: 'readingText is required' })
  }

  const reading: Reading = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name: body.name,
    birthDate: body.birthDate,
    birthTime: body.birthTime,
    sunSign: body.sunSign,
    moonSign: body.moonSign,
    risingSign: body.risingSign,
    deckId: body.deckId,
    deckName: body.deckName,
    card: body.card,
    transitPlanet: body.transitPlanet,
    readingText: body.readingText,
    spreadSize: body.spreadSize,
    spreadCards: body.spreadCards,
    spreadPositions: body.spreadPositions,
    priorReadingCount: body.priorReadingCount,
    cosmicDate: body.cosmicDate,
    cosmicImpact: body.cosmicImpact,
  }

  if (pool) {
    const result = await pool.query(
      `INSERT INTO readings (id, name, birth_date, birth_time, sun_sign, moon_sign, rising_sign, deck_id, deck_name, card, transit_planet, spread_size, spread_cards, spread_positions, prior_reading_count, cosmic_date, cosmic_impact, reading_text)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14::jsonb,$15,$16,$17,$18)
       RETURNING *`,
      [reading.id, reading.name, reading.birthDate, reading.birthTime, reading.sunSign, reading.moonSign, reading.risingSign, reading.deckId, reading.deckName, reading.card, reading.transitPlanet, reading.spreadSize, JSON.stringify(reading.spreadCards || []), JSON.stringify(reading.spreadPositions || []), reading.priorReadingCount || 0, reading.cosmicDate, reading.cosmicImpact, reading.readingText],
    )
    return res.status(201).json({ data: mapReading(result.rows[0]) })
  }

  readings.push(reading)
  if (readings.length > MAX_READINGS) readings.splice(0, readings.length - MAX_READINGS)
  res.status(201).json({ data: reading })
})

app.get('/api/readings/:id', async (req: Request, res: Response) => {
  const reading = pool
    ? (await pool.query('SELECT * FROM readings WHERE id = $1', [req.params.id])).rows.map(mapReading)[0]
    : readings.find((r) => r.id === req.params.id)
  if (!reading) {
    return res.status(404).json({ error: 'Reading not found' })
  }
  res.json({ data: reading })
})

app.get('/api/readings', async (req: Request, res: Response) => {
  const limit = Math.min(parseInt(String(req.query.limit || '20'), 10) || 20, 100)
  if (pool) {
    const result = await pool.query('SELECT * FROM readings ORDER BY created_at DESC LIMIT $1', [limit])
    return res.json({ data: result.rows.map(mapReading) })
  }
  res.json({ data: readings.slice(-limit).reverse() })
})

app.listen(PORT, () => {
  console.log(`🌌 Cosmos API running on http://localhost:${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
})

export default app
