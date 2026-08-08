// Component layer for Cosmic Dispatch
import { createSignal, For } from 'solid-js'

interface AstroEvent {
  name: string
  hint: string
}

interface CosmicDispatchProps {
  events: AstroEvent[]
  onRevealBomb: (name: string) => void
  onNextEvent: () => void
}

export function CosmicDispatch(props: CosmicDispatchProps) {
  const [name, setName] = createSignal('')
  const [eventIndex, setEventIndex] = createSignal(0)
  const [message, setMessage] = createSignal(
    'The cosmos is listening. Tap a star to ignite a new insight.',
  )
  const [feed, setFeed] = createSignal([
    'Cosmic feed initialized. Ready for astral updates.',
  ])

  const currentEvent = () => props.events[eventIndex()]

  const revealBomb = () => {
    const bomb = `${name() ? `${name()}, ` : ''}[cosmic truth]`
    setMessage(bomb)
    setFeed((current) => [bomb, ...current].slice(0, 6))
    props.onRevealBomb(bomb)
  }

  const nextEvent = () => {
    const next = (eventIndex() + 1) % props.events.length
    setEventIndex(next)
    const nextMessage = `Incoming ${props.events[next].name}: ${props.events[next].hint}`
    setMessage(nextMessage)
    setFeed((current) => [nextMessage, ...current].slice(0, 6))
    props.onNextEvent()
  }

  return (
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
        <For each={props.events}>{(event) => (
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
  )
}
