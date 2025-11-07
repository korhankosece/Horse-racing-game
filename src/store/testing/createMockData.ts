import type { Horse, Round, RoundResult } from '@/types'

export const createMockHorse = (overrides?: Partial<Horse>): Horse => ({
  id: 'horse-1',
  name: 'Test Horse',
  condition: 100,
  color: '#FF0000',
  ...overrides,
})

export const createMockRound = (overrides?: Partial<Round>): Round => ({
  number: 1,
  distance: 1200,
  horses: [createMockHorse({ id: 'horse-1' }), createMockHorse({ id: 'horse-2' })],
  ...overrides,
})

export const createMockRoundResult = (overrides?: Partial<RoundResult>): RoundResult => ({
  number: 1,
  distance: 1200,
  horses: [],
  ...overrides,
})

