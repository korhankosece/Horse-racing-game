import { RACE_CONFIG } from '@/config'
import type { ActionContext } from './types'
import { calculateSpeed, getTrackLength, getCurrentRoundResult, initializeRound } from './helpers'

export const actions = {
  startRace({ commit, state, rootState, dispatch }: ActionContext): void {
    if (rootState.program.rounds.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('No rounds available. Please generate program first.')
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

      // eslint-disable-next-line no-console
      console.log('🏁 Race Started!', {
        round: state.currentRound,
        distance: currentRoundData.distance,
        horses: currentRoundData.horses.map(h => ({ name: h.name, condition: h.condition })),
      })
    }

    const interval = setInterval(() => {
      dispatch('tickRace')
    }, RACE_CONFIG.interval)

    commit('SET_RACE_INTERVAL', interval)
  },

  pauseRace({ commit, state }: ActionContext): void {
    if (state.raceStatus === 'running') {
      commit('SET_RACE_STATUS', 'paused')
      const currentRoundResult = getCurrentRoundResult(state)
      // eslint-disable-next-line no-console
      console.log('⏸️ Race Paused', {
        round: state.currentRound,
        finishedHorses: currentRoundResult?.horses.length || 0,
      })
    }
  },

  resumeRace({ commit, state, dispatch }: ActionContext): void {
    if (state.raceStatus === 'paused') {
      commit('SET_RACE_STATUS', 'running')
      const currentRoundResult = getCurrentRoundResult(state)
      // eslint-disable-next-line no-console
      console.log('▶️ Race Resumed', {
        round: state.currentRound,
        finishedHorses: currentRoundResult?.horses.length || 0,
      })

      const interval = setInterval(() => {
        dispatch('tickRace')
      }, RACE_CONFIG.interval)

      commit('SET_RACE_INTERVAL', interval)
    }
  },

  stopRace({ commit }: ActionContext): void {
    commit('RESET_RACE')
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

    // Update positions for all horses in current round
    currentRoundData.horses.forEach(horse => {
      // Skip if horse already finished
      const isFinished = currentRoundResult.horses.some(result => result.horse.id === horse.id)
      if (isFinished) {
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

        // eslint-disable-next-line no-console
        console.log(`🏆 Horse Finished! Position: ${position}`, {
          name: horse.name,
          condition: horse.condition,
          round: state.currentRound,
        })
      }
    })

    // Check if all horses finished
    if (currentRoundResult.horses.length === currentRoundData.horses.length) {
      const nextRound = state.currentRound + 1

      if (nextRound <= rootState.program.rounds.length) {
        // Move to next round
        commit('SET_CURRENT_ROUND', nextRound)
        commit('RESET_ROUND')

        const nextRoundData = rootState.program.rounds.find(r => r.number === nextRound)
        if (nextRoundData) {
          initializeRound(nextRound, nextRoundData, commit, state)

          // eslint-disable-next-line no-console
          console.log('🔄 Round Finished! Moving to next round...', {
            previousRound: state.currentRound - 1,
            currentRound: nextRound,
            distance: nextRoundData.distance,
            horses: nextRoundData.horses.map(h => ({ name: h.name, condition: h.condition })),
          })
        }
      } else {
        // All rounds finished
        commit('SET_RACE_STATUS', 'finished')
        if (state.raceInterval) {
          clearInterval(state.raceInterval)
          commit('SET_RACE_INTERVAL', null)
        }
        // eslint-disable-next-line no-console
        console.log('🎉 Race Finished! All rounds completed.', {
          totalRounds: rootState.program.rounds.length,
        })
      }
    }
  },
}
