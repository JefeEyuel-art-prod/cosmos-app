import { createSignal, For, onMount } from 'solid-js'
import './App.css'
import {
  zodiacSigns,
  getSunSignName,
  estimateMoonSign,
  estimateRisingSign,
  findZodiacSign,
  type ZodiacSign,
} from './services/astrology'
import { loadPreferences, savePreferences } from './services/preferences'
import { drawTarotCard, fetchCosmicCalendar, fetchDailyCosmicForecast, fetchRecentReadings, fetchTarotDecks, fetchTransitData, saveReading, type CosmicEvent, type DailyCosmicForecast, type SavedReading, type TarotCard, type TarotDeck, type Transit } from './services/api'

const pillars = [
  {
    title: 'Signal Clarity',
    description: 'Transform raw ideas into focused insight through calm, intelligent synthesis.',
  },
  {
    title: 'Human Connection',
    description: 'Bridge personal intuition with collective wisdom to unlock deeper understanding.',
  },
  {
    title: 'Infinite Expansion',
    description: 'Explore new pathways of thought and create meaning beyond ordinary limits.',
  },
]

const signals = ['Vision', 'Memory', 'Awareness', 'Creation']
const auraDots = [0, 1, 2, 3, 4, 5]

const astroEvents = [
  {
    name: 'Lunar Eclipse',
    hint: 'Shift your focus; hidden intentions become vivid under the shadow.',
  },
  {
    name: 'Meteor Shower',
    hint: 'A rush of inspiration lands from unexpected directions.',
  },
  {
    name: 'Supernova Pulse',
    hint: 'A powerful burst of clarity reshapes your inner landscape.',
  },
  {
    name: 'Zodiac Gate',
    hint: 'The soul’s pattern is aligning with fresh meaning.',
  },
  {
    name: 'Solar Wind',
    hint: 'Soft momentum carries truth across a quiet distance.',
  },
]

const trueBombs = [
  'Every star you notice is a mirror of the choice you’re ready to make.',
  'Cosmologie says you are not lost; you are orbiting toward a deeper point of view.',
  'Astrology reveals patterns, but only your attention turns them into action.',
  'A true bomb lands when presence meets a question.',
  'The universe whispers through symbols; you translate them by staying present.',
]

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

// Multiple selectable Tarot decks, each with its own theme and card set.
const tarotDecks = [
  {
    id: 'classic',
    name: 'Classic Arcana',
    description: 'The traditional living deck — foundational archetypes for everyday clarity.',
    cards: [
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
    ],
  },
  {
    id: 'lunar',
    name: 'Lunar Shadow Deck',
    description: 'A moon-phase deck for shadow work — what hides beneath becomes visible here.',
    cards: [
      { symbol: '🌑', title: 'New Moon Seed', energy: 'Invisible beginnings, planting intention in the dark.' },
      { symbol: '🌒', title: 'Waxing Whisper', energy: 'Quiet momentum building beneath the surface.' },
      { symbol: '🌓', title: 'Half-Lit Threshold', energy: 'Standing between what was and what is becoming.' },
      { symbol: '🌔', title: 'Gibbous Unveiling', energy: 'Almost-truths that are ready to fully surface.' },
      { symbol: '🌕', title: 'Full Moon Mirror', energy: 'Total illumination; nothing stays hidden tonight.' },
      { symbol: '🌖', title: 'Waning Release', energy: 'Letting go of what has already served its purpose.' },
      { symbol: '🌗', title: 'Balsamic Rest', energy: 'Sacred emptiness before the next cycle begins.' },
      { symbol: '🜏', title: 'Shadow Keeper', energy: 'The part of you that holds what you disown.' },
      { symbol: '☍', title: 'Eclipse Reveal', energy: 'A sudden, unavoidable confrontation with truth.' },
      { symbol: '✧', title: 'Dream Threshold', energy: 'Guidance arriving through sleep, symbol, and instinct.' },
    ],
  },
  {
    id: 'solar',
    name: 'Solar Flame Deck',
    description: 'A fire-forged deck for bold action — reach for it when you need momentum, not comfort.',
    cards: [
      { symbol: '☀', title: 'Dawn Spark', energy: 'The first flicker of resolve at the start of a new day.' },
      { symbol: '🔥', title: 'Solar Flare', energy: 'Sudden, radiant force that clears everything in its path.' },
      { symbol: '♨', title: 'Ember Vow', energy: 'A quiet promise kept alive long after the fire dims.' },
      { symbol: '☼', title: 'Noon Radiance', energy: 'Full visibility; your effort is undeniable now.' },
      { symbol: '🜂', title: 'Phoenix Ash', energy: 'What burned away makes room for a truer shape.' },
      { symbol: '➳', title: 'Golden Path', energy: 'A clear direction opens once you commit fully.' },
      { symbol: '⚔', title: 'Sunfire Oath', energy: 'Courageous commitment that demands follow-through.' },
      { symbol: '♆', title: 'Eclipse Crown', energy: 'Leadership that emerges precisely when light is scarce.' },
      { symbol: '⛰', title: 'Horizon Call', energy: 'An invitation to expand beyond your usual limits.' },
      { symbol: '★', title: 'Zenith Light', energy: 'Peak clarity; the moment your purpose is unmistakable.' },
    ],
  },
]

const galaxyImages = [
  {
    src: '/galaxy1.svg',
    label: 'Nova Spiral',
    description: 'A violet spiral arm caught mid-collapse, seeding new stars along its glowing filaments.',
  },
  {
    src: '/galaxy2.svg',
    label: 'Cosmic Bloom',
    description: 'A magenta nebula unfurling like a flower, its gas clouds lit from within by newborn suns.',
  },
  {
    src: '/galaxy3.svg',
    label: 'Nebula Mirage',
    description: 'An icy blue cloud drifting through deep space, bending starlight into a shimmering mirage.',
  },
  {
    src: '/galaxy4.svg',
    label: 'Solar Ember',
    description: 'An amber core radiating slow heat, tracing ember-lit trails across the void.',
  },
  {
    src: '/galaxy5.svg',
    label: 'Emerald Drift',
    description: 'A jade-green cluster pulsing gently, its light drifting like aurora across the starfield.',
  },
]

const spreadPositions: Record<1 | 3 | 5 | 9, string[]> = {
  1: ['Focus'],
  3: ['Past', 'Present', 'Future'],
  5: ['Situation', 'Challenge', 'Guidance', 'Action', 'Outcome'],
  9: ['Self', 'Root', 'Past', 'Present', 'Future', 'Challenge', 'Guidance', 'Hidden influence', 'Integration'],
}

const spreadTemplates: Record<1 | 3 | 5 | 9, string[]> = {
  1: ['Focus: identify the single truth that deserves attention today.'],
  3: ['Past: name the pattern that shaped the question.', 'Present: describe what is actually active now.', 'Future: choose the direction your next action makes more likely.'],
  5: ['Situation: define the real context without adding a prediction.', 'Challenge: locate the friction, fear, or assumption.', 'Guidance: identify the perspective that changes the reading.', 'Action: select a behavior you can observe and complete.', 'Outcome: describe the likely result if the action is practiced.'],
  9: ['Self: notice your current stance and agency.', 'Root: trace the deeper cause beneath the visible issue.', 'Past: identify the inherited pattern or recent history.', 'Present: read the immediate reality without fantasy.', 'Future: name the trajectory already being built.', 'Challenge: locate resistance and its useful information.', 'Guidance: find the principle that can organize the spread.', 'Hidden influence: surface what is affecting the situation indirectly.', 'Integration: convert the full pattern into one grounded commitment.'],
}

const fallbackDecks: TarotDeck[] = tarotDecks.map((deck) => ({
  ...deck,
  cards: deck.cards.map((card) => ({
    ...card,
    theme: card.energy,
    shadow: 'Notice where this energy becomes unbalanced or performative.',
    question: `Where does ${card.title} meet your current situation?`,
    action: 'Choose one small action that tests this insight in real life.',
  })),
}))

function App() {
  const [name, setName] = createSignal('')
  const [eventIndex, setEventIndex] = createSignal(0)
  const [message, setMessage] = createSignal(
    'The cosmos is listening. Tap a star to ignite a new insight.',
  )
  const [transits, setTransits] = createSignal<Transit[]>(transitLog)
  const [selectedTransit, setSelectedTransit] = createSignal<Transit>(transitLog[0])
  const [feed, setFeed] = createSignal([
    'Cosmic feed initialized. Ready for astral updates.',
  ])

  // Tarot: which deck is active, and which card is currently selected within it.
  const [decks, setDecks] = createSignal<TarotDeck[]>(fallbackDecks)
  const [selectedDeckId, setSelectedDeckId] = createSignal(fallbackDecks[0].id)
  const activeDeck = () => decks().find((deck) => deck.id === selectedDeckId()) ?? fallbackDecks[0]
  const [selectedTarot, setSelectedTarot] = createSignal<TarotCard>(fallbackDecks[0].cards[0])
  const [spreadSize, setSpreadSize] = createSignal<1 | 3 | 5 | 9>(1)
  const [spreadCards, setSpreadCards] = createSignal<TarotCard[]>([fallbackDecks[0].cards[0]])
  const [tarotMessage, setTarotMessage] = createSignal(
    'Select a card to feel its energetic signification, or draw a new card from the deck.',
  )

  // Birth chart + zodiac wheel state.
  const [birthDate, setBirthDate] = createSignal('')
  const [birthTime, setBirthTime] = createSignal('')
  const [utcOffset, setUtcOffset] = createSignal(0)
  const [latitude, setLatitude] = createSignal(0)
  const [longitude, setLongitude] = createSignal(0)
  const [selectedZodiac, setSelectedZodiac] = createSignal<ZodiacSign | null>(null)
  const [deepReading, setDeepReading] = createSignal(
    'Enter your birth date and draw a card to weave a deeper diagnostic of your current situation.',
  )
  const [savingReading, setSavingReading] = createSignal(false)
  const [savedReadingId, setSavedReadingId] = createSignal<string | null>(null)
  const [feedback, setFeedback] = createSignal('')
  const [showGuide, setShowGuide] = createSignal(true)
  const [savedReadings, setSavedReadings] = createSignal<SavedReading[]>([])
  const [historyLoading, setHistoryLoading] = createSignal(false)
  const [dataLoading, setDataLoading] = createSignal(false)
  const [dataError, setDataError] = createSignal('')
  const [dailyForecast, setDailyForecast] = createSignal<DailyCosmicForecast | null>(null)
  const [cosmicCalendar, setCosmicCalendar] = createSignal<CosmicEvent[]>([])

  // Load any persisted selections once the component mounts (browser-only).
  onMount(async () => {
    const prefs = loadPreferences()
    setDataLoading(true)
    try {
      const [remoteDecks, remoteTransits] = await Promise.all([fetchTarotDecks(), fetchTransitData()])
      if (remoteDecks.length) {
        setDecks(remoteDecks)
        const firstDeck = remoteDecks.find((deck) => deck.id === (prefs.selectedDeckId || 'classic')) ?? remoteDecks[0]
        setSelectedDeckId(firstDeck.id)
        setSelectedTarot(firstDeck.cards[0])
      }
      if (remoteTransits.length) {
        setTransits(remoteTransits)
        setSelectedTransit(remoteTransits[0])
      }
    } catch {
      setDataError('Using the local constellation while the API reconnects.')
    } finally {
      setDataLoading(false)
    }
    try {
      setCosmicCalendar(await fetchCosmicCalendar())
    } catch {
      setDataError('The cosmic calendar is unavailable until the API reconnects.')
    }
    setHistoryLoading(true)
    try {
      setSavedReadings(await fetchRecentReadings())
    } catch {
      setFeedback('Reading history is unavailable until the API reconnects.')
    } finally {
      setHistoryLoading(false)
    }
    if (prefs.selectedDeckId) {
      const deck = decks().find((d) => d.id === prefs.selectedDeckId)
      if (deck) {
        setSelectedDeckId(deck.id)
        setSelectedTarot(deck.cards[0])
      }
    }
    if (prefs.selectedZodiacName) {
      const sign = findZodiacSign(prefs.selectedZodiacName)
      if (sign) setSelectedZodiac(sign)
    }
    if (prefs.birthDate) setBirthDate(prefs.birthDate)
    if (prefs.birthTime) setBirthTime(prefs.birthTime)
    if (typeof prefs.utcOffsetHours === 'number') setUtcOffset(prefs.utcOffsetHours)
    if (typeof prefs.latitude === 'number') setLatitude(prefs.latitude)
    if (typeof prefs.longitude === 'number') setLongitude(prefs.longitude)
    if (prefs.name) setName(prefs.name)
    await refreshDailyForecast()
  })

  const sunZodiac = () => findZodiacSign(getSunSignName(birthDate()))
  const moonSignName = () => estimateMoonSign(birthDate(), birthTime() || undefined)
  const moonZodiac = () => findZodiacSign(moonSignName())
  const risingSignName = () =>
    birthTime() ? estimateRisingSign(birthDate(), birthTime(), utcOffset(), latitude(), longitude()) : null
  const risingZodiac = () => findZodiacSign(risingSignName())

  const activeZodiac = () => selectedZodiac() ?? sunZodiac()

  const currentEvent = () => astroEvents[eventIndex()]

  const refreshDailyForecast = async () => {
    try {
      setDailyForecast(await fetchDailyCosmicForecast({
        sunSign: sunZodiac()?.name,
        moonSign: moonZodiac()?.name,
        risingSign: risingZodiac()?.name,
      }))
    } catch {
      setDataError('Daily cosmic weather is unavailable until the API reconnects.')
    }
  }

  const revealBomb = () => {
    const bomb = trueBombs[Math.floor(Math.random() * trueBombs.length)]
    const nextMessage = `${name() ? `${name()}, ` : ''}${bomb}`
    setMessage(nextMessage)
    setFeed((current) => [nextMessage, ...current].slice(0, 6))
    setFeedback('A new insight has entered your feed.')
  }

  const nextEvent = () => {
    const next = (eventIndex() + 1) % astroEvents.length
    setEventIndex(next)
    const nextMessage = `Incoming ${astroEvents[next].name}: ${astroEvents[next].hint}`
    setMessage(nextMessage)
    setFeed((current) => [nextMessage, ...current].slice(0, 6))
    setFeedback(`${astroEvents[next].name} is now active.`)
  }

  const selectTransit = (entry: Transit) => {
    setSelectedTransit(entry)
    setMessage(`Now aligning with ${entry.planet} (${entry.myth}) — ${entry.note}`)
    setFeedback(`${entry.planet} is now part of your reading.`)
  }

  const selectDeck = (deckId: string) => {
    setSelectedDeckId(deckId)
    savePreferences({ selectedDeckId: deckId })
    const deck = decks().find((d) => d.id === deckId)
    if (deck) {
      setSelectedTarot(deck.cards[0])
      setTarotMessage(`Switched to ${deck.name}. ${deck.description}`)
    }
  }

  const selectTarot = (card: TarotCard) => {
    setSelectedTarot(card)
    setTarotMessage(`${card.title}: ${card.theme}`)
    setFeedback(`${card.title} selected. Generate a reading when ready.`)
  }

  const drawTarot = async () => {
    try {
      const drawn = await drawTarotCard(activeDeck().id, spreadSize())
      setSpreadCards(drawn.cards)
      setSelectedTarot(drawn.cards[0])
      setTarotMessage(`${drawn.cards.length}-card spread drawn. Read each position as part of one story.`)
      setFeedback(`${drawn.cards.length}-card ${activeDeck().name} spread is ready.`)
    } catch {
      const cards = activeDeck().cards
      const drawn = Array.from({ length: spreadSize() }, (_, index) => cards[index % cards.length])
      setSpreadCards(drawn)
      setSelectedTarot(drawn[0])
      setTarotMessage(`${drawn.length}-card local spread drawn while the API reconnects.`)
      setDataError('The API draw failed, so a local spread was drawn instead.')
      setFeedback(`${drawn.length}-card spread is ready.`)
    }
  }

  const chooseSpread = (size: 1 | 3 | 5 | 9) => {
    setSpreadSize(size)
    setSpreadCards([activeDeck().cards[0]])
    setSelectedTarot(activeDeck().cards[0])
    setTarotMessage(size === 1 ? 'Single-card reflection selected.' : `${size}-card spread selected: ${spreadPositions[size].join(' · ')}. Draw when ready.`)
  }

  const resetJourney = () => {
    setName('')
    setBirthDate('')
    setBirthTime('')
    setUtcOffset(0)
    setLatitude(0)
    setLongitude(0)
    setSelectedZodiac(null)
    setSelectedTarot(decks()[0].cards[0])
    setSpreadCards([decks()[0].cards[0]])
    setSpreadSize(1)
    setSelectedDeckId(decks()[0].id)
    setSavedReadingId(null)
    setDeepReading('Enter your birth date and draw a card to weave a deeper diagnostic of your current situation.')
    savePreferences({ name: '', birthDate: '', birthTime: '', utcOffsetHours: 0, latitude: 0, longitude: 0, selectedZodiacName: null, selectedDeckId: decks()[0].id })
    setFeedback('Your journey has been reset.')
  }

  const copyReading = async () => {
    if (!deepReading() || !navigator.clipboard) return
    await navigator.clipboard.writeText(deepReading())
    setFeedback('Reading copied to your clipboard.')
  }

  const selectZodiac = (sign: ZodiacSign) => {
    setSelectedZodiac(sign)
    savePreferences({ selectedZodiacName: sign.name })
  }

  const onBirthDateInput = (value: string) => {
    setBirthDate(value)
    savePreferences({ birthDate: value })
  }

  const onBirthTimeInput = (value: string) => {
    setBirthTime(value)
    savePreferences({ birthTime: value })
  }

  const onUtcOffsetInput = (value: number) => {
    setUtcOffset(value)
    savePreferences({ utcOffsetHours: value })
  }

  const onLatitudeInput = (value: number) => {
    setLatitude(value)
    savePreferences({ latitude: value })
  }

  const onLongitudeInput = (value: number) => {
    setLongitude(value)
    savePreferences({ longitude: value })
  }

  const onNameInput = (value: string) => {
    setName(value)
    savePreferences({ name: value })
  }

  const generateDeepReading = async () => {
    const zodiac = activeZodiac()
    if (!zodiac) {
      setDeepReading('Add your birth date (or tap a zodiac sign) so the reading can anchor to your chart.')
      return
    }
    const cards = spreadCards()
    const transit = selectedTransit()
    const moon = moonZodiac()
    const rising = risingZodiac()
    const previous = savedReadings().slice(0, 3)
    const moonLine = moon ? ` Moon: ${moon.name}, adding an emotional lens.` : ' Moon: not estimated yet.'
    const risingLine = rising ? ` Rising: ${rising.name}, shaping how the pattern appears outwardly.` : ' Rising: add birth time and location for this layer.'
    const historyLine = previous.length ? ` Your ${previous.length} recent reading${previous.length > 1 ? 's are' : ' is'} treated as context, not destiny; look for repeated questions rather than repeated predictions.` : ' This is your first saved reading, so future pulls can be compared against it.'
    await refreshDailyForecast()
    const forecast = dailyForecast()
    const positions = spreadPositions[spreadSize()]
    const templateLines = spreadTemplates[spreadSize()].join(' ')
    const cardLines = cards.map((card, index) => `${positions[index] || `Card ${index + 1}`} holds ${card.title}: ${card.theme} Watch for ${card.shadow} Ask: ${card.question} Practice: ${card.action}`).join(' ')
    const cosmicLine = forecast ? ` Daily sky (${forecast.date}): ${forecast.alignment}; ${forecast.retrograde}. Collective theme: ${forecast.collective} Personal impact: ${forecast.impact}` : ''
    const reading = `${spreadSize()}-card personal spread for ${name() || 'the seeker'}: ${zodiac.symbol} ${zodiac.name} Sun (${zodiac.element}, ruled by ${zodiac.ruler}) meets the ${transit.planet} ${transit.dimension.toLowerCase()} transit.${moonLine}${risingLine}${historyLine}${cosmicLine} Analysis template: ${templateLines} Analysis method: read each named position first, then compare the sequence for repeating themes, tensions, and movement from context to action. ${cardLines}`

    setDeepReading(reading)
    setFeed((current) => [reading, ...current].slice(0, 6))
    setSavedReadingId(null)
    setSavingReading(true)
    try {
      const saved = await saveReading({
        name: name() || undefined,
        birthDate: birthDate() || undefined,
        birthTime: birthTime() || undefined,
        sunSign: zodiac.name,
        moonSign: moon?.name,
        risingSign: rising?.name,
        deckId: activeDeck().id,
        deckName: activeDeck().name,
        card: cards[0].title,
        transitPlanet: transit.planet,
        spreadSize: spreadSize(),
        spreadCards: cards.map((card) => card.title),
        spreadPositions: positions,
        priorReadingCount: previous.length,
        cosmicDate: forecast?.date,
        cosmicImpact: forecast?.impact,
        readingText: reading,
      })
      setSavedReadingId(saved.id)
      setSavedReadings((current) => [saved, ...current.filter((item) => item.id !== saved.id)].slice(0, 20))
    } catch {
      // Backend may be briefly unreachable (e.g. simulated failures); the
      // reading is still shown locally even if saving/sharing fails.
      setSavedReadingId(null)
    } finally {
      setSavingReading(false)
    }
  }

  return (
    <div class="app-shell">
      <header class="hero-card">
        <div class="journey-status" aria-live="polite">
          <span class="status-orb" />
          <span>{feedback() || 'Your personal cosmic workspace'}</span>
        </div>
        <p class="eyebrow">Cosmos App</p>
        <h1>Linking higher forms of intelligence.</h1>
        <p class="hero-copy">
          Cosmos is a living space for thought, where human curiosity meets elevated awareness.
          It helps people turn complexity into clarity and imagination into action.
        </p>
        <div class="hero-actions">
          <a class="primary-btn" href="#begin">Begin the journey</a>
          <a class="secondary-btn" href="#vision">Explore the vision</a>
        </div>

        <div class="hero-visual">
          <div class="neon-core" />
          <div class="neon-guts" />
          <div class="neon-pulse">
            <For each={auraDots}>{() => <span class="neon-dot" />}</For>
          </div>
        </div>
      </header>

      <nav class="section-nav" aria-label="Cosmos sections">
        <a href="#dispatch">Dispatch</a>
        <a href="#transits">Transits</a>
        <a href="#weather">Today</a>
        <a href="#calendar">Calendar</a>
        <a href="#tarot">Tarot</a>
        <a href="#chart">Birth chart</a>
        <a href="#history">History</a>
        <a href="#gallery">Gallery</a>
        <button type="button" class="reset-btn" onClick={resetJourney}>Reset</button>
      </nav>

      <section class="signal-row" id="vision">
        {dataLoading() && <div class="data-status">Syncing tarot and transit archives…</div>}
        {dataError() && <div class="data-status warning">{dataError()}</div>}
        <div class="guide-card">
          <div>
            <strong>Start here</strong>
            <span>{showGuide() ? 'Choose a transit, draw a card, then generate your personal reading.' : 'Your workspace is ready whenever you are.'}</span>
          </div>
          <button type="button" class="guide-toggle" onClick={() => setShowGuide((visible) => !visible)}>
            {showGuide() ? 'Hide guide' : 'Show guide'}
          </button>
        </div>
        <For each={signals}>{(signal) => (
          <div class="signal-pill">{signal}</div>
        )}</For>
      </section>

      <section class="content-grid" id="begin">
        <article class="panel intro-panel">
          <h2>What Cosmos is becoming</h2>
          <p>
            A calm intelligence layer for modern minds. Cosmos gathers thought, context, and possibility
            into one elegant experience so you can think bigger and act with intention.
          </p>
        </article>

        <article class="panel pillars-panel">
          <h2>Core pillars</h2>
          <div class="pillar-list">
            <For each={pillars}>{(pillar) => (
              <div class="pillar-card">
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </div>
            )}</For>
          </div>
        </article>

        <article class="panel cosmic-panel" id="dispatch">
          <h2>Cosmic Dispatch</h2>
          <p>
            Short interactive panel for lightning-fast cosmology and astrology events. Drop true bombs,
            feel the pulse of the universe, and keep the experience vivid.
          </p>

          <div class="cosmic-controls">
            <input
              class="cosmic-input"
              type="text"
              placeholder="Name your star-self"
              value={name()}
              onInput={(e) => onNameInput(e.currentTarget.value)}
            />
            <button class="cosmic-action" type="button" onClick={revealBomb}>
              Drop true bomb
            </button>
            <button class="cosmic-action secondary" type="button" onClick={nextEvent}>
              Next astral event
            </button>
          </div>

          <div class="cosmic-status">
            <span class="cosmic-badge">{currentEvent().name}</span>
            <p class="cosmic-message">{message()}</p>
          </div>

          <div class="cosmic-feed">
            <span class="feed-label">Astral event feed</span>
            <ul>
              <For each={feed()}>{(entry) => (
                <li class="feed-entry">
                  <span>•</span> {entry}
                </li>
              )}</For>
            </ul>
          </div>

          <div class="astro-list">
            <For each={astroEvents}>{(event) => (
              <div class="astro-chip">{event.name}</div>
            )}</For>
          </div>

          <div class="starfield">
            <span class="star" style="--x: 12%; --y: 18%; --scale: 1.1;"></span>
            <span class="star" style="--x: 32%; --y: 10%; --scale: 0.9;"></span>
            <span class="star" style="--x: 72%; --y: 16%; --scale: 1.3;"></span>
            <span class="star" style="--x: 28%; --y: 58%; --scale: 0.85;"></span>
            <span class="star" style="--x: 54%; --y: 28%; --scale: 1.2;"></span>
            <span class="star" style="--x: 82%; --y: 44%; --scale: 0.75;"></span>
          </div>
        </article>

        <article class="panel cosmic-weather-panel" id="weather">
          <div class="weather-header">
            <div>
              <h2>Today’s cosmic weather</h2>
              <p>Updated from the current UTC date. Use it as reflective context, not a fixed prediction.</p>
            </div>
            <button type="button" class="secondary-action" onClick={refreshDailyForecast}>Refresh</button>
          </div>
          {dailyForecast() ? (
            <div class="weather-grid">
              <div><strong>{dailyForecast()!.alignment}</strong><span>{dailyForecast()!.status}</span></div>
              <div><strong>Retrograde watch</strong><span>{dailyForecast()!.retrograde}</span></div>
              <div><strong>Collective consciousness</strong><span>{dailyForecast()!.collective}</span></div>
              <div><strong>Your chart impact</strong><span>{dailyForecast()!.impact}</span></div>
            </div>
          ) : <p class="history-empty">Add chart information or refresh to read today’s sky.</p>}
        </article>

        <article class="panel calendar-panel" id="calendar">
          <div class="weather-header">
            <div>
              <h2>Upcoming planetary events</h2>
              <p>Local dates are calculated from your browser timezone.</p>
            </div>
          </div>
          <div class="calendar-list">
            <For each={cosmicCalendar()}>{(event) => (
              <div class="calendar-event">
                <time>{event.date}</time>
                <div><strong>{event.label}</strong><span>{event.kind} · {event.description}</span></div>
              </div>
            )}</For>
          </div>
        </article>

        <article class="panel transit-panel" id="transits">
          <div class="transit-header">
            <div>
              <h2>Astrology Transit Log</h2>
              <p>
                Planetary symbols, archetypes, and mythic energies aligned with people and gods. Use it as a cosmic map for your next decision.
              </p>
            </div>
            <span class="transit-badge">Planetary forces</span>
          </div>

          <div class="transit-path">
            {transits().map((entry, index) => (
              <span
                class="path-node"
                classList={{ active: selectedTransit().planet === entry.planet }}
                style={`--i: ${index}`}
                onClick={() => selectTransit(entry)}
              >
                {entry.symbol}
              </span>
            ))}
          </div>

          <div class="transit-grid">
            <For each={transits()}>{(entry) => (
              <div
                class={`transit-card${selectedTransit().planet === entry.planet ? ' selected' : ''}`}
                onClick={() => selectTransit(entry)}
              >
                <div class="transit-symbol">{entry.symbol}</div>
                <div class="transit-meta">
                  <h3>{entry.planet}</h3>
                  <p class="transit-archetype">{entry.archetype} · {entry.myth}</p>
                  <p>{entry.note}</p>
                  <p class="transit-detail-line">
                    <strong>Day:</strong> {entry.day} · <strong>Best conjunction:</strong> {entry.dimension}
                  </p>
                </div>
              </div>
            )}</For>
          </div>

          <div class="transit-detail">
            <h3>Selected transit</h3>
            <p>
              <strong>{selectedTransit().planet} ({selectedTransit().symbol})</strong> with the energy of{' '}
              <strong>{selectedTransit().myth}</strong>. Best aligned with{' '}
              <strong>{selectedTransit().dimension}</strong> and the rhythm of{' '}
              <strong>{selectedTransit().day}</strong>.
            </p>
            <p>{selectedTransit().note}</p>
          </div>
        </article>

        <article class="panel tarot-panel" id="tarot">
          <div class="tarot-header">
            <div>
              <h2>Tarot Decks</h2>
              <p>{activeDeck().description} Select a card to study its theme, shadow, question, and real-world practice.</p>
            </div>
            <div class="spread-controls" aria-label="Choose spread size">
              <span>Spread</span>
              <For each={[1, 3, 5, 9] as const}>{(size) => (
                <button type="button" class={`spread-size${spreadSize() === size ? ' active' : ''}`} onClick={() => chooseSpread(size)}>
                  {size === 1 ? '1 card' : `${size} cards`}
                </button>
              )}</For>
              <button class="tarot-draw-btn" type="button" onClick={drawTarot}>
                Draw spread
              </button>
            </div>
          </div>

          <div class="deck-tabs">
            <For each={decks()}>{(deck) => (
              <button
                type="button"
                class={`deck-tab${selectedDeckId() === deck.id ? ' active' : ''}`}
                onClick={() => selectDeck(deck.id)}
              >
                {deck.name}
              </button>
            )}</For>
          </div>

          <div class="tarot-status">
            <div class="tarot-preview">
              <div class="tarot-preview-symbol">{selectedTarot().symbol}</div>
              <div>
                <h3>{selectedTarot().title}</h3>
                <p>{selectedTarot().energy}</p>
              </div>
            </div>
            <p class="tarot-message">{tarotMessage()}</p>
            <div class="spread-cards" aria-label="Cards in current spread">
              <For each={spreadCards()}>{(card, index) => (
                <button type="button" class={`spread-card${selectedTarot().title === card.title ? ' active' : ''}`} onClick={() => selectTarot(card)}>
                  <span>{spreadPositions[spreadSize()][index()] || `Card ${index() + 1}`}</span>
                  <strong>{card.symbol}</strong>
                  <small>{card.title}</small>
                </button>
              )}</For>
            </div>
            <div class="tarot-analysis-grid">
              <div><strong>Core theme</strong><span>{selectedTarot().theme}</span></div>
              <div><strong>Watch for</strong><span>{selectedTarot().shadow}</span></div>
              <div><strong>Ask yourself</strong><span>{selectedTarot().question}</span></div>
              <div><strong>Practice</strong><span>{selectedTarot().action}</span></div>
            </div>
          </div>

          <div class="tarot-grid">
            <For each={activeDeck().cards}>{(card) => (
              <button
                type="button"
                class={`tarot-card-button${selectedTarot().title === card.title ? ' active' : ''}`}
                onClick={() => selectTarot(card)}
              >
                <span class="tarot-symbol-small">{card.symbol}</span>
                <span>{card.title}</span>
              </button>
            )}</For>
          </div>
        </article>

        <article class="panel history-panel" id="history">
          <div class="history-header">
            <div>
              <h2>Saved readings</h2>
              <p>Return to the questions and practices you generated before.</p>
            </div>
            <span class="transit-badge">{savedReadings().length} saved</span>
          </div>
          {historyLoading() && <p class="history-empty">Loading your reading history…</p>}
          {!historyLoading() && savedReadings().length === 0 && (
            <p class="history-empty">Generate a deep reading and it will appear here.</p>
          )}
          <div class="history-list">
            <For each={savedReadings()}>{(reading) => (
              <button type="button" class="history-item" onClick={() => {
                setDeepReading(reading.readingText)
                setSavedReadingId(reading.id)
                setFeedback(`Reopened ${reading.card || 'saved reading'}.`)
              }}>
                <span class="history-item-title">{reading.card || 'Cosmic reading'}</span>
                <span>{reading.spreadSize || 1}-card spread · {reading.sunSign || 'Chart unknown'} · {reading.transitPlanet || 'Transit unknown'}</span>
                {reading.spreadPositions?.length && <small>{reading.spreadPositions.join(' · ')}</small>}
                <small>{new Date(reading.createdAt).toLocaleString()}</small>
              </button>
            )}</For>
          </div>
        </article>

        <article class="panel zodiac-panel" id="chart">
          <div class="zodiac-header">
            <div>
              <h2>Birth Chart & Zodiac Wheel</h2>
              <p>
                Enter your birth date, time, and location to estimate your Sun, Moon, and Rising signs, then
                blend them with a tarot pull and the current transit for a deeper diagnostic of your situation.
              </p>
            </div>
          </div>

          <div class="birth-chart-form">
            <div class="birth-chart-field">
              <label class="birth-chart-label" for="birth-date">Birth date</label>
              <input
                id="birth-date"
                class="birth-chart-input"
                type="date"
                value={birthDate()}
                onInput={(e) => onBirthDateInput(e.currentTarget.value)}
              />
            </div>

            <div class="birth-chart-field">
              <label class="birth-chart-label" for="birth-time">Birth time (optional)</label>
              <input
                id="birth-time"
                class="birth-chart-input"
                type="time"
                value={birthTime()}
                onInput={(e) => onBirthTimeInput(e.currentTarget.value)}
              />
            </div>

            <div class="birth-chart-field">
              <label class="birth-chart-label" for="utc-offset">UTC offset (hrs)</label>
              <input
                id="utc-offset"
                class="birth-chart-input birth-chart-input-narrow"
                type="number"
                step="0.5"
                min="-12"
                max="14"
                value={utcOffset()}
                onInput={(e) => onUtcOffsetInput(Number(e.currentTarget.value))}
              />
            </div>

            <div class="birth-chart-field">
              <label class="birth-chart-label" for="birth-lat">Latitude</label>
              <input
                id="birth-lat"
                class="birth-chart-input birth-chart-input-narrow"
                type="number"
                step="0.01"
                value={latitude()}
                onInput={(e) => onLatitudeInput(Number(e.currentTarget.value))}
              />
            </div>

            <div class="birth-chart-field">
              <label class="birth-chart-label" for="birth-lon">Longitude</label>
              <input
                id="birth-lon"
                class="birth-chart-input birth-chart-input-narrow"
                type="number"
                step="0.01"
                value={longitude()}
                onInput={(e) => onLongitudeInput(Number(e.currentTarget.value))}
              />
            </div>
          </div>

          <div class="chart-summary">
            <div class="chart-summary-card">
              <span class="chart-summary-label">☉ Sun</span>
              <span class="chart-summary-value">
                {sunZodiac() ? `${sunZodiac()!.symbol} ${sunZodiac()!.name}` : 'Add birth date'}
              </span>
            </div>
            <div class="chart-summary-card">
              <span class="chart-summary-label">☾ Moon (est.)</span>
              <span class="chart-summary-value">
                {moonZodiac() ? `${moonZodiac()!.symbol} ${moonZodiac()!.name}` : 'Add birth date'}
              </span>
            </div>
            <div class="chart-summary-card">
              <span class="chart-summary-label">↑ Rising (est.)</span>
              <span class="chart-summary-value">
                {risingZodiac() ? `${risingZodiac()!.symbol} ${risingZodiac()!.name}` : 'Add birth time & location'}
              </span>
            </div>
          </div>
          <p class="chart-disclaimer">
            Moon and Rising signs are estimated with simplified orbital formulas, not a full ephemeris — treat them
            as a close approximation, especially near sign boundaries.
          </p>

          <div class="zodiac-grid">
            <For each={zodiacSigns}>{(sign) => (
              <button
                type="button"
                class={`zodiac-chip${activeZodiac()?.name === sign.name ? ' active' : ''}`}
                onClick={() => selectZodiac(sign)}
              >
                <span class="zodiac-symbol">{sign.symbol}</span>
                <span class="zodiac-name">{sign.name}</span>
              </button>
            )}</For>
          </div>

          <div class="zodiac-detail">
            <h3>{activeZodiac()?.name ?? 'Select a sign'}</h3>
            <p>{activeZodiac()?.trait ?? 'Tap a sign above or enter your birth date to see its archetype.'}</p>
            {activeZodiac() && (
              <p class="zodiac-detail-line">
                <strong>Dates:</strong> {activeZodiac()!.dates} · <strong>Element:</strong> {activeZodiac()!.element} ·{' '}
                <strong>Ruler:</strong> {activeZodiac()!.ruler}
              </p>
            )}
          </div>

          <div class="reading-actions">
            <button class="deep-reading-btn" type="button" onClick={generateDeepReading} disabled={savingReading()}>
            {savingReading() ? 'Saving reading…' : 'Generate deep reading'}
            </button>
            <button class="secondary-action" type="button" onClick={copyReading} disabled={!deepReading() || savingReading()}>
              Copy reading
            </button>
          </div>
          <p class="deep-reading-message" aria-live="polite">{deepReading()}</p>
          {savedReadingId() && (
            <p class="deep-reading-share">
              Saved. Share this reading with id: <code>{savedReadingId()}</code>
            </p>
          )}
        </article>

        <article class="panel galaxy-panel" id="gallery">
          <div class="galaxy-header">
            <div>
              <h2>Galaxy Gallery</h2>
              <p>Preview a few glowing nebulae and spirals in the cosmos, with neon energy overlays.</p>
            </div>
          </div>

          <div class="galaxy-grid">
            <For each={galaxyImages}>{(image) => (
              <div class="galaxy-card">
                <div class="galaxy-card-image">
                  <img src={image.src} alt={image.label} loading="lazy" />
                </div>
                <div class="galaxy-card-body">
                  <span class="galaxy-card-label">{image.label}</span>
                  <p class="galaxy-card-description">{image.description}</p>
                </div>
              </div>
            )}</For>
          </div>
        </article>
      </section>
    </div>
  )
}

export default App
