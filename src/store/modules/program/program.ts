import type { Module } from 'vuex'
import type { Horse, Round } from '@/types'
import { HORSE_NAMES } from '@/data/horseNames'
import { HORSE_COLORS } from '@/data/horseColors'
import { ROUND_DISTANCES, TOTAL_HORSES, HORSES_PER_ROUND } from '@/config'

export interface ProgramState {
  horses: Horse[]
  rounds: Round[]
}

// Helper function to get unique random item from array
export const getUniqueRandomItem = <T>(array: T[], used: Set<T>): T | null => {
  const available = array.filter(item => !used.has(item))
  if (available.length === 0) return null
  const randomIndex = Math.floor(Math.random() * available.length)
  return available[randomIndex]!
}

const generateHorses = (): Horse[] => {
  const generatedHorses: Horse[] = []
  const usedNames = new Set<string>()
  const usedColors = new Set<string>()

  for (let i = 0; i < TOTAL_HORSES; i++) {
    const name = getUniqueRandomItem(HORSE_NAMES, usedNames)!
    const color = getUniqueRandomItem(HORSE_COLORS, usedColors)!

    usedNames.add(name)
    usedColors.add(color)

    generatedHorses.push({
      id: `horse-${i + 1}`,
      name,
      condition: Math.floor(Math.random() * 100) + 1,
      color,
    })
  }

  return generatedHorses
}

const generateSchedule = (horses: Horse[]): Round[] => {
  const generatedRounds: Round[] = []

  ROUND_DISTANCES.forEach((distance, index) => {
    const shuffled = [...horses].sort(() => Math.random() - 0.5)
    const selectedHorses = shuffled.slice(0, HORSES_PER_ROUND)

    generatedRounds.push({
      number: index + 1,
      distance,
      horses: selectedHorses,
    })
  })

  return generatedRounds
}

const programModule: Module<ProgramState, unknown> = {
  namespaced: true,

  state: (): ProgramState => ({
    horses: [],
    rounds: [],
  }),

  mutations: {
    SET_HORSES(state: ProgramState, horses: Horse[]) {
      state.horses = horses
    },

    SET_ROUNDS(state: ProgramState, rounds: Round[]) {
      state.rounds = rounds
    },
  },

  actions: {
    generateHorses({ commit }: { commit: (mutation: string, payload?: unknown) => void }): Horse[] {
      const horses = generateHorses()
      commit('SET_HORSES', horses)
      return horses
    },

    generateProgram({
      commit,
      state,
    }: {
      commit: (mutation: string, payload?: unknown) => void
      state: ProgramState
    }): void {
      if (state.horses.length === 0) {
        const horses = generateHorses()
        commit('SET_HORSES', horses)
      }
      const rounds = generateSchedule(state.horses)
      commit('SET_ROUNDS', rounds)
    },
  },

  getters: {
    horses: (state: ProgramState) => state.horses,
    rounds: (state: ProgramState) => state.rounds,
  },
}

export default programModule
