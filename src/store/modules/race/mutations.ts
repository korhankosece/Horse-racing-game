import type { Horse, RoundResult } from '@/types'

import type { RaceState, RaceStatus } from './types'

export const mutations = {
  SET_CURRENT_ROUND(state: RaceState, round: number) {
    state.currentRound = round
  },

  SET_RACE_STATUS(state: RaceState, status: RaceStatus) {
    state.raceStatus = status
  },

  SET_HORSE_POSITION(state: RaceState, { horseId, position }: { horseId: string; position: number }) {
    state.horsePositions[horseId] = position
  },

  ADD_ROUND_RESULT(
    state: RaceState,
    { roundNumber, position, horse }: { roundNumber: number; position: number; horse: Horse }
  ) {
    const roundResult = state.allRoundResults.find(r => r.number === roundNumber)
    if (roundResult) {
      roundResult.horses.push({ position, horse })
    }
  },

  INITIALIZE_ROUND_RESULT(state: RaceState, roundResult: RoundResult) {
    state.allRoundResults.push(roundResult)
  },

  RESET_RACE(state: RaceState) {
    state.horsePositions = {}
    state.allRoundResults = []
    state.currentRound = 1
    state.raceStatus = 'idle'
    state.showRoundTransition = false
    state.nextRoundNumber = null
    if (state.raceInterval) {
      clearInterval(state.raceInterval)
      state.raceInterval = null
    }
  },

  SHOW_ROUND_TRANSITION(state: RaceState, nextRound: number) {
    state.showRoundTransition = true
    state.nextRoundNumber = nextRound
  },

  HIDE_ROUND_TRANSITION(state: RaceState) {
    state.showRoundTransition = false
    state.nextRoundNumber = null
  },

  RESET_ROUND(state: RaceState) {
    state.horsePositions = {}
  },

  SET_RACE_INTERVAL(state: RaceState, interval: number | null) {
    if (state.raceInterval) {
      clearInterval(state.raceInterval)
    }
    state.raceInterval = interval
  },
}
