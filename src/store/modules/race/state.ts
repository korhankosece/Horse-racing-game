import type { RaceState } from './types'

export const initialState: RaceState = {
  currentRound: 1,
  raceStatus: 'idle',
  horsePositions: {},
  allRoundResults: [],
  raceInterval: null,
  showRoundTransition: false,
  nextRoundNumber: null,
}
