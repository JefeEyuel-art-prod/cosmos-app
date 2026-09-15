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
import { saveReading } from './services/api'

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

function App() {
  const [name, setName] = createSignal('')
  const [eventIndex, setEventIndex] = createSignal(0)
  const [message, setMessage] = createSignal(
    'The cosmos is listening. Tap a star to ignite a new insight.',
  )
  const [selectedTransit, setSelectedTransit] = createSignal(transitLog[0])
  const [feed, setFeed] = createSignal([
    'Cosmic feed initialized. Ready for astral updates.',
  ])

  // Tarot: which deck is active, and which card is currently selected within it.
  const [selectedDeckId, setSelectedDeckId] = createSignal(tarotDecks[0].id)
  const activeDeck = () => tarotDecks.find((deck) => deck.id === selectedDeckId()) ?? tarotDecks[0]
  const [selectedTarot, setSelectedTarot] = createSignal(tarotDecks[0].cards[0])
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

  // Load any persisted selections once the component mounts (browser-only).
  onMount(() => {
    const prefs = loadPreferences()
    if (prefs.selectedDeckId) {
      const deck = tarotDecks.find((d) => d.id === prefs.selectedDeckId)
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
  })

  const sunZodiac = () => findZodiacSign(getSunSignName(birthDate()))
  const moonSignName = () => estimateMoonSign(birthDate(), birthTime() || undefined)
  const moonZodiac = () => findZodiacSign(moonSignName())
  const risingSignName = () =>
    birthTime() ? estimateRisingSign(birthDate(), birthTime(), utcOffset(), latitude(), longitude()) : null
  const risingZodiac = () => findZodiacSign(risingSignName())

  const activeZodiac = () => selectedZodiac() ?? sunZodiac()

  const currentEvent = () => astroEvents[eventIndex()]

  const revealBomb = () => {
    const bomb = trueBombs[Math.floor(Math.random() * trueBombs.length)]
    const nextMessage = `${name() ? `${name()}, ` : ''}${bomb}`
    setMessage(nextMessage)
    setFeed((current) => [nextMessage, ...current].slice(0, 6))
  }

  const nextEvent = () => {
    const next = (eventIndex() + 1) % astroEvents.length
    setEventIndex(next)
    const nextMessage = `Incoming ${astroEvents[next].name}: ${astroEvents[next].hint}`
    setMessage(nextMessage)
    setFeed((current) => [nextMessage, ...current].slice(0, 6))
  }

  const selectTransit = (entry: typeof transitLog[number]) => {
    setSelectedTransit(entry)
    setMessage(`Now aligning with ${entry.planet} (${entry.myth}) — ${entry.note}`)
  }

  const selectDeck = (deckId: string) => {
    setSelectedDeckId(deckId)
    savePreferences({ selectedDeckId: deckId })
    const deck = tarotDecks.find((d) => d.id === deckId)
    if (deck) {
      setSelectedTarot(deck.cards[0])
      setTarotMessage(`Switched to ${deck.name}. ${deck.description}`)
    }
  }

  const selectTarot = (card: typeof tarotDecks[number]['cards'][number]) => {
    setSelectedTarot(card)
    setTarotMessage(`${card.title} resonates with ${card.energy}`)
  }

  const drawTarot = () => {
    const cards = activeDeck().cards
    const card = cards[Math.floor(Math.random() * cards.length)]
    setSelectedTarot(card)
    setTarotMessage(`You drew ${card.title}: ${card.energy}`)
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
    const card = selectedTarot()
    const transit = selectedTransit()
    const moon = moonZodiac()
    const rising = risingZodiac()

    const moonLine = moon ? ` Your Moon sign is estimated as ${moon.symbol} ${moon.name}, coloring your emotional undercurrent.` : ''
    const risingLine = rising ? ` Your Rising sign is estimated as ${rising.symbol} ${rising.name}, shaping how this shows up outwardly.` : ''

    const reading = `${zodiac.symbol} ${zodiac.name} Sun (${zodiac.element}, ruled by ${zodiac.ruler}) meets ${card.title} under the ${transit.planet} transit: ${card.energy}${moonLine}${risingLine} Combined with a nature that is ${zodiac.trait.toLowerCase()} — and the pull of ${transit.myth} — this points toward a situation asking you to move from ${transit.dimension.toLowerCase()} into clear action.`

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
        card: card.title,
        transitPlanet: transit.planet,
        readingText: reading,
      })
      setSavedReadingId(saved.id)
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

      <section class="signal-row" id="vision">
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

        <article class="panel cosmic-panel">
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

        <article class="panel transit-panel">
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
            {transitLog.map((entry, index) => (
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
            <For each={transitLog}>{(entry) => (
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

        <article class="panel tarot-panel">
          <div class="tarot-header">
            <div>
              <h2>Tarot Decks</h2>
              <p>{activeDeck().description}</p>
            </div>
            <button class="tarot-draw-btn" type="button" onClick={drawTarot}>
              Draw a card
            </button>
          </div>

          <div class="deck-tabs">
            <For each={tarotDecks}>{(deck) => (
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

        <article class="panel zodiac-panel">
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

          <button class="deep-reading-btn" type="button" onClick={generateDeepReading} disabled={savingReading()}>
            {savingReading() ? 'Saving reading…' : 'Generate deep reading'}
          </button>
          <p class="deep-reading-message">{deepReading()}</p>
          {savedReadingId() && (
            <p class="deep-reading-share">
              Saved. Share this reading with id: <code>{savedReadingId()}</code>
            </p>
          )}
        </article>

        <article class="panel galaxy-panel">
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
