// Component layer for Transits
import { createSignal, For } from 'solid-js'

interface Transit {
  symbol: string
  planet: string
  archetype: string
  myth: string
  day: string
  dimension: string
  note: string
}

interface TransitPanelProps {
  transits: Transit[]
  onSelectTransit: (transit: Transit) => void
}

export function TransitPanel(props: TransitPanelProps) {
  const [selectedTransit, setSelectedTransit] = createSignal(props.transits[0])

  const handleSelect = (transit: Transit) => {
    setSelectedTransit(transit)
    props.onSelectTransit(transit)
  }

  return (
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
        {props.transits.map((entry, index) => (
          <span
            class="path-node"
            classList={{ active: selectedTransit().planet === entry.planet }}
            style={`--i: ${index}`}
            onClick={() => handleSelect(entry)}
          >
            {entry.symbol}
          </span>
        ))}
      </div>

      <div class="transit-grid">
        <For each={props.transits}>{(entry) => (
          <div
            class={`transit-card${selectedTransit().planet === entry.planet ? ' selected' : ''}`}
            onClick={() => handleSelect(entry)}
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
  )
}
