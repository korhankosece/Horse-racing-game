import { RACE_CONFIG } from '@/config'

import { calculateSpeed, getCurrentRoundResult, getTrackLength, initializeRound } from './helpers'
import type { ActionContext } from './types'

export const actions = {
  startRace({ commit, state, rootState, dispatch }: ActionContext): void {
    if (rootState.program.rounds.length === 0) {
      return
    }

    if (state.raceStatus === 'running') {
      return
    }

    // Reset race if starting fresh
    if (state.raceStatus === 'idle' || state.raceStatus === 'finished') {
      commit('RESET_RACE')
      commit('SET_CURRENT_ROUND', 1)
    }

    commit('SET_RACE_STATUS', 'running')

    const currentRoundData = rootState.program.rounds.find(r => r.number === state.currentRound)
    if (currentRoundData) {
      initializeRound(state.currentRound, currentRoundData, commit, state)
    }

    const interval = setInterval(() => {
      dispatch('tickRace')
    }, RACE_CONFIG.interval)

    commit('SET_RACE_INTERVAL', interval)
  },

  pauseRace({ commit, state }: ActionContext): void {
    if (state.raceStatus === 'running') {
      commit('SET_RACE_STATUS', 'paused')
      if (state.raceInterval) {
        clearInterval(state.raceInterval)
        commit('SET_RACE_INTERVAL', null)
      }
    }
  },

  resumeRace({ commit, state, dispatch }: ActionContext): void {
    if (state.raceStatus === 'paused') {
      commit('SET_RACE_STATUS', 'running')

      const interval = setInterval(() => {
        dispatch('tickRace')
      }, RACE_CONFIG.interval)

      commit('SET_RACE_INTERVAL', interval)
    }
  },

  stopRace({ commit }: ActionContext): void {
    commit('RESET_RACE')
  },

  startNextRound({ commit, state, rootState, dispatch }: ActionContext): void {
    if (!state.nextRoundNumber) return

    const nextRound = state.nextRoundNumber
    commit('HIDE_ROUND_TRANSITION')
    commit('SET_CURRENT_ROUND', nextRound)
    commit('RESET_ROUND')

    const nextRoundData = rootState.program.rounds.find(r => r.number === nextRound)
    if (nextRoundData) {
      initializeRound(nextRound, nextRoundData, commit, state)
    }

    commit('SET_RACE_STATUS', 'running')

    const interval = setInterval(() => {
      dispatch('tickRace')
    }, RACE_CONFIG.interval)

    commit('SET_RACE_INTERVAL', interval)
  },

  tickRace({ commit, state, rootState }: ActionContext): void {
    if (state.raceStatus !== 'running') {
      return
    }

    const currentRoundData = rootState.program.rounds.find(r => r.number === state.currentRound)
    if (!currentRoundData) {
      commit('SET_RACE_STATUS', 'finished')
      return
    }

    const trackLength = getTrackLength(currentRoundData.distance)
    const currentRoundResult = getCurrentRoundResult(state)

    if (!currentRoundResult) {
      return
    }

    // Create Set of finished horse IDs for O(1) lookup
    const finishedHorseIds = new Set(
      currentRoundResult.horses.map(result => result.horse.id)
    )

    // Update positions for all horses in current round
    currentRoundData.horses.forEach(horse => {
      // Skip if horse already finished
      if (finishedHorseIds.has(horse.id)) {
        return
      }

      const currentPosition = state.horsePositions[horse.id] || 0
      const speed = calculateSpeed(horse)
      const newPosition = Math.min(currentPosition + speed, trackLength)

      commit('SET_HORSE_POSITION', { horseId: horse.id, position: newPosition })

      // Check if horse finished
      if (newPosition >= trackLength) {
        const position = currentRoundResult.horses.length + 1
        commit('ADD_ROUND_RESULT', {
          roundNumber: state.currentRound,
          position,
          horse,
        })
      }
    })

    // Check if all horses finished
    if (currentRoundResult.horses.length === currentRoundData.horses.length) {
      const nextRound = state.currentRound + 1

      if (nextRound <= rootState.program.rounds.length) {
        // Pause race and show transition modal
        commit('SET_RACE_STATUS', 'paused')
        if (state.raceInterval) {
          clearInterval(state.raceInterval)
          commit('SET_RACE_INTERVAL', null)
        }
        commit('SHOW_ROUND_TRANSITION', nextRound)
      } else {
        // All rounds finished
        commit('SET_RACE_STATUS', 'finished')
        if (state.raceInterval) {
          clearInterval(state.raceInterval)
          commit('SET_RACE_INTERVAL', null)
        }
      }
    }
  },
}
