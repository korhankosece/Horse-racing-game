import type { Module } from 'vuex'
import type { Horse } from '@/types'
import { RACE_CONFIG } from '@/config'
import type { ProgramState } from './program'

export type RaceStatus = 'idle' | 'running' | 'paused' | 'finished'

export interface RaceState {
  currentRound: number
  raceStatus: RaceStatus
  horsePositions: Record<string, number> // horseId -> position in pixels
  currentRoundResults: Array<{ position: number; horse: Horse }>
  raceInterval: number | null
}

interface RootState {
  program: ProgramState
  race: RaceState
}

const raceModule: Module<RaceState, RootState> = {
  namespaced: true,

  state: {
    currentRound: 1,
    raceStatus: 'idle',
    horsePositions: {},
    currentRoundResults: [],
    raceInterval: null,
  },

  mutations: {
    SET_CURRENT_ROUND(state: RaceState, round: number) {
      state.currentRound = round
    },

    SET_RACE_STATUS(state: RaceState, status: RaceStatus) {
      state.raceStatus = status
    },

    SET_HORSE_POSITION(state: RaceState, { horseId, position }: { horseId: string; position: number }) {
      state.horsePositions[horseId] = position
    },

    ADD_ROUND_RESULT(state: RaceState, { position, horse }: { position: number; horse: Horse }) {
      state.currentRoundResults.push({ position, horse })
    },

    RESET_RACE(state: RaceState) {
      state.horsePositions = {}
      state.currentRoundResults = []
      state.currentRound = 1
      state.raceStatus = 'idle'
      if (state.raceInterval) {
        clearInterval(state.raceInterval)
        state.raceInterval = null
      }
    },

    RESET_ROUND(state: RaceState) {
      state.horsePositions = {}
      state.currentRoundResults = []
    },

    SET_RACE_INTERVAL(state: RaceState, interval: number | null) {
      if (state.raceInterval) {
        clearInterval(state.raceInterval)
      }
      state.raceInterval = interval
    },
  },

  actions: {
    startRace({
      commit,
      state,
      rootState,
      dispatch,
    }: {
      commit: (mutation: string, payload?: unknown) => void
      state: RaceState
      rootState: RootState
      dispatch: (action: string, payload?: unknown) => void
    }): void {
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

      // Initialize horse positions for current round
      const currentRoundData = rootState.program.rounds.find(r => r.number === state.currentRound)
      if (currentRoundData) {
        currentRoundData.horses.forEach(horse => {
          if (!(horse.id in state.horsePositions)) {
            commit('SET_HORSE_POSITION', { horseId: horse.id, position: 0 })
          }
        })

        // eslint-disable-next-line no-console
        console.log('🏁 Race Started!', {
          round: state.currentRound,
          distance: currentRoundData.distance,
          horses: currentRoundData.horses.map(h => ({ name: h.name, condition: h.condition })),
        })
      }

      // Start the race interval
      const interval = setInterval(() => {
        dispatch('tickRace')
      }, RACE_CONFIG.interval)

      commit('SET_RACE_INTERVAL', interval)
    },

    pauseRace({
      commit,
      state,
    }: {
      commit: (mutation: string, payload?: unknown) => void
      state: RaceState
    }): void {
      if (state.raceStatus === 'running') {
        commit('SET_RACE_STATUS', 'paused')
        // eslint-disable-next-line no-console
        console.log('⏸️ Race Paused', {
          round: state.currentRound,
          finishedHorses: state.currentRoundResults.length,
        })
      }
    },

    resumeRace({
      commit,
      state,
      dispatch,
    }: {
      commit: (mutation: string, payload?: unknown) => void
      state: RaceState
      dispatch: (action: string, payload?: unknown) => void
    }): void {
      if (state.raceStatus === 'paused') {
        commit('SET_RACE_STATUS', 'running')
        // eslint-disable-next-line no-console
        console.log('▶️ Race Resumed', {
          round: state.currentRound,
          finishedHorses: state.currentRoundResults.length,
        })

        // Restart the race interval
        const interval = setInterval(() => {
          dispatch('tickRace')
        }, RACE_CONFIG.interval)

        commit('SET_RACE_INTERVAL', interval)
      }
    },

    stopRace({
      commit,
    }: {
      commit: (mutation: string, payload?: unknown) => void
    }): void {
      commit('RESET_RACE')
    },

    tickRace({
      commit,
      state,
      rootState,
    }: {
      commit: (mutation: string, payload?: unknown) => void
      state: RaceState
      rootState: RootState
    }): void {
      if (state.raceStatus !== 'running') {
        return
      }

      const currentRoundData = rootState.program.rounds.find(r => r.number === state.currentRound)
      if (!currentRoundData) {
        commit('SET_RACE_STATUS', 'finished')
        return
      }

      const trackLength =
        RACE_CONFIG.trackLengths[currentRoundData.distance as keyof typeof RACE_CONFIG.trackLengths] || 600

      // Update positions for all horses in current round
      currentRoundData.horses.forEach(horse => {
        // Skip if horse already finished
        const isFinished = state.currentRoundResults.some(result => result.horse.id === horse.id)
        if (isFinished) {
          return
        }

        const currentPosition = state.horsePositions[horse.id] || 0

        // Calculate speed based on condition
        // Base speed: random between 5-50 pixels per tick
        const baseSpeed = Math.random() * (RACE_CONFIG.maxSpeed - 5) + 5

        // Condition multiplier: condition (1-100) -> 0.3-1.0 multiplier
        // Higher condition = faster horse
        const conditionMultiplier = 0.3 + (horse.condition / 100) * 0.7

        // Final speed: baseSpeed * conditionMultiplier
        const speed = baseSpeed * conditionMultiplier

        // Update position
        const newPosition = Math.min(currentPosition + speed, trackLength)
        commit('SET_HORSE_POSITION', { horseId: horse.id, position: newPosition })

        // Check if horse finished
        if (newPosition >= trackLength) {
          const position = state.currentRoundResults.length + 1
          commit('ADD_ROUND_RESULT', { position, horse })
          // eslint-disable-next-line no-console
          console.log(`🏆 Horse Finished! Position: ${position}`, {
            name: horse.name,
            condition: horse.condition,
            round: state.currentRound,
          })
        }
      })

      // Check if all horses finished
      if (state.currentRoundResults.length === currentRoundData.horses.length) {
        // All horses finished, move to next round or finish race
        const nextRound = state.currentRound + 1
        if (nextRound <= rootState.program.rounds.length) {
          // Move to next round
          commit('SET_CURRENT_ROUND', nextRound)
          // Reset positions and results for new round
          commit('RESET_ROUND')
          // Initialize positions for next round
          const nextRoundData = rootState.program.rounds.find(r => r.number === nextRound)
          if (nextRoundData) {
            nextRoundData.horses.forEach(horse => {
              commit('SET_HORSE_POSITION', { horseId: horse.id, position: 0 })
            })

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
  },

  getters: {
    currentRound: (state: RaceState) => state.currentRound,
    raceStatus: (state: RaceState) => state.raceStatus,
    horsePositions: (state: RaceState) => state.horsePositions,
    currentRoundResults: (state: RaceState) => state.currentRoundResults,
  },
}

export default raceModule
