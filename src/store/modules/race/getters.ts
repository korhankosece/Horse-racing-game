import type { RaceState } from './types'

export const getters = {
  currentRound: (state: RaceState) => state.currentRound,
  raceStatus: (state: RaceState) => state.raceStatus,
  horsePositions: (state: RaceState) => state.horsePositions,
  currentRoundResults: (state: RaceState) =>
    state.allRoundResults.find(r => r.number === state.currentRound)?.horses || [],
  allRoundResults: (state: RaceState) => state.allRoundResults,
  showRoundTransition: (state: RaceState) => state.showRoundTransition,
  nextRoundNumber: (state: RaceState) => state.nextRoundNumber,
}
