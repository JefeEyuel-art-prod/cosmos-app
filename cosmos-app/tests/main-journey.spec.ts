import { test, expect } from '@playwright/test'

const decks = [{
  id: 'classic',
  name: 'Classic Arcana',
  description: 'Foundational archetypes for everyday clarity.',
  cards: [{
    symbol: '0',
    title: 'The Fool',
    energy: 'Fresh beginnings',
    theme: 'Begin without pretending certainty.',
    shadow: 'Impulsiveness or avoiding responsibility.',
    question: 'What first step can you take before you know the whole path?',
    action: 'Name one reversible experiment and take it today.',
  }],
}]

const transit = [{
  symbol: '☿',
  planet: 'Mercury',
  archetype: 'Messenger',
  myth: 'Hermes',
  day: 'Wednesday',
  dimension: 'Mind / Technology',
  note: 'Communication is quick and ready to reshape thoughts.',
}]

test('user can select a card, inspect its method, and save a reading', async ({ page }) => {
  await page.route('**/api/tarot', async (route) => route.fulfill({ json: { data: decks } }))
  await page.route('**/api/transits', async (route) => route.fulfill({ json: { data: transit } }))
  await page.route('**/api/cosmic/calendar**', async (route) => route.fulfill({ json: { data: [{ date: '2026-01-01', label: 'Today', kind: 'Alignment', description: 'A practical reset.' }] } }))
  await page.route('**/api/cosmic/today**', async (route) => route.fulfill({ json: { data: {
    date: '2026-01-01',
    alignment: 'Mercury trine Saturn',
    status: 'Direct',
    retrograde: 'No featured retrograde today',
    focus: 'Clear thinking becomes easier when ideas receive structure.',
    collective: 'Communities may favor practical plans.',
    impact: 'Your Aries chart lens meets this sky through clear thinking.',
  } } }))
  await page.route('**/api/readings?limit=20', async (route) => route.fulfill({ json: { data: [] } }))
  await page.route('**/api/readings', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 201, json: { data: {
        id: 'reading-1',
        createdAt: '2026-01-01T00:00:00.000Z',
        card: 'The Fool',
        sunSign: 'Aries',
        transitPlanet: 'Mercury',
        readingText: 'A test reading',
      } } })
    }
  })

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Tarot Decks' })).toBeVisible()
  await page.locator('.tarot-card-button').filter({ hasText: 'The Fool' }).click()
  await expect(page.getByText('Core theme')).toBeVisible()
  await expect(page.getByText('Today’s cosmic weather')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Upcoming planetary events' })).toBeVisible()
  await page.getByRole('button', { name: '5 cards' }).click()
  await expect(page.getByText('Situation · Challenge · Guidance · Action · Outcome')).toBeVisible()
  await page.getByRole('button', { name: 'Draw spread' }).click()
  await expect(page.getByText(/5-card/).first()).toBeVisible()
  await page.getByRole('link', { name: 'Birth chart' }).click()
  await page.locator('#birth-date').fill('1990-04-01')
  await page.getByRole('button', { name: 'Generate deep reading' }).click()
  await expect(page.getByText('Saved. Share this reading with id:')).toBeVisible()
  await expect(page.locator('.deep-reading-message')).toContainText('5-card personal spread')
  await expect(page.locator('.deep-reading-message')).toContainText('Situation holds')
  await page.getByRole('link', { name: 'History' }).click()
  await expect(page.locator('.history-item-title', { hasText: 'The Fool' })).toBeVisible()
})
