import { RACE_CONFIG } from '@/config'
import type { Horse, Round, RoundResult } from '@/types'

import type { RaceState } from './types'

export const calculateSpeed = (horse: Horse): number => {
  const baseSpeed = Math.random() * (RACE_CONFIG.maxSpeed - 5) + 5
  const conditionMultiplier = 0.3 + (horse.condition / 100) * 0.7
  return baseSpeed * conditionMultiplier
}

export const getTrackLength = (distance: number): number =>
  RACE_CONFIG.trackLengths[distance as keyof typeof RACE_CONFIG.trackLengths] || 600

export const getCurrentRoundResult = (state: RaceState): RoundResult | undefined =>
  state.allRoundResults.find(r => r.number === state.currentRound)

export const initializeRound = (
  roundNumber: number,
  roundData: Round,
  commit: (mutation: string, payload?: unknown) => void,
  state: RaceState
): void => {
  // Initialize horse positions
  roundData.horses.forEach(horse => {
    if (!(horse.id in state.horsePositions)) {
      commit('SET_HORSE_POSITION', { horseId: horse.id, position: 0 })
    }
  })

  // Initialize empty round result
  const roundResult: RoundResult = {
    number: roundNumber,
    distance: roundData.distance,
    horses: [],
  }
  commit('INITIALIZE_ROUND_RESULT', roundResult)
}
