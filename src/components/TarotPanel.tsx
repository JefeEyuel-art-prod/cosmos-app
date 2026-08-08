// Component layer for Tarot
import { createSignal, For } from 'solid-js'

interface TarotCard {
  symbol: string
  title: string
  energy: string
}

interface TarotPanelProps {
  cards: TarotCard[]
  onDraw: () => void
}

export function TarotPanel(props: TarotPanelProps) {
  const [selectedTarot, setSelectedTarot] = createSignal(props.cards[0])
  const [tarotMessage, setTarotMessage] = createSignal(
    'Select a card to feel its energetic signification, or draw a new card from the deck.',
  )

  const selectTarot = (card: TarotCard) => {
    setSelectedTarot(card)
    setTarotMessage(`${card.title} resonates with ${card.energy}`)
  }

  const drawTarot = () => {
    props.onDraw()
  }

  return (
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
        <For each={props.cards}>{(card) => (
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
  )
}
