import type { RaceState } from './types'

export const getters = {
  currentRound: (state: RaceState) => state.currentRound,
  raceStatus: (state: RaceState) => state.raceStatus,
  horsePositions: (state: RaceState) => state.horsePositions,
  currentRoundResults: (state: RaceState) => {
    const roundResult = state.allRoundResults.find(r => r.number === state.currentRound)
    return roundResult?.horses || []
  },
  allRoundResults: (state: RaceState) => state.allRoundResults,
}
