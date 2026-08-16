import { createSignal, For } from 'solid-js'
import './App.css'

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

const tarotDeck = [
  {
    symbol: '0',
    title: 'The Fool',
    energy: 'Fresh beginnings, trust in the journey, bold initiation.',
  },
  {
    symbol: 'I',
    title: 'The Magician',
    energy: 'Manifestation, clever resourcefulness, channeling creative power.',
  },
  {
    symbol: 'II',
    title: 'The High Priestess',
    energy: 'Inner knowing, subtle intuition, sacred mystery.',
  },
  {
    symbol: 'III',
    title: 'The Empress',
    energy: 'Nurturing abundance, fertile creativity, embodied grace.',
  },
  {
    symbol: 'IV',
    title: 'The Emperor',
    energy: 'Authority, structure, stable leadership, protective strength.',
  },
  {
    symbol: 'VI',
    title: 'The Lovers',
    energy: 'Soulful choice, alignment, conscious relationship.',
  },
  {
    symbol: 'VII',
    title: 'The Chariot',
    energy: 'Focused action, momentum, courageous direction.',
  },
  {
    symbol: 'VIII',
    title: 'Strength',
    energy: 'Gentle power, inner resilience, compassionate courage.',
  },
  {
    symbol: 'IX',
    title: 'The Hermit',
    energy: 'Wise reflection, restful clarity, personal truth.',
  },
  {
    symbol: 'XVII',
    title: 'The Star',
    energy: 'Hope renewed, spiritual vision, calming inspiration.',
  },
]

const galaxyImages = [
  { src: '/galaxy1.svg', label: 'Nova Spiral' },
  { src: '/galaxy2.svg', label: 'Cosmic Bloom' },
  { src: '/galaxy3.svg', label: 'Nebula Mirage' },
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
  const [selectedTarot, setSelectedTarot] = createSignal(tarotDeck[0])
  const [tarotMessage, setTarotMessage] = createSignal(
    'Select a card to feel its energetic signification, or draw a new card from the deck.',
  )

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

  const selectTarot = (card: typeof tarotDeck[number]) => {
    setSelectedTarot(card)
    setTarotMessage(`${card.title} resonates with ${card.energy}`)
  }

  const drawTarot = () => {
    const card = tarotDeck[Math.floor(Math.random() * tarotDeck.length)]
    setSelectedTarot(card)
    setTarotMessage(`You drew ${card.title}: ${card.energy}`)
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
              onInput={(e) => setName(e.currentTarget.value)}
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
              <h2>Tarot Deck</h2>
              <p>
                A living deck to honor energetic signification. Draw a card or tap a symbol to feel the archetype.
              </p>
            </div>
            <button class="tarot-draw-btn" type="button" onClick={drawTarot}>
              Draw a card
            </button>
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
            <For each={tarotDeck}>{(card) => (
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
                <img src={image.src} alt={image.label} />
                <span>{image.label}</span>
              </div>
            )}</For>
          </div>
        </article>
      </section>
    </div>
  )
}

export default App
