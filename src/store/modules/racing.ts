import type { Module } from 'vuex'
import type { Horse, Round } from '@/types'
import { HORSE_NAMES } from '@/data/horseNames'
import { HORSE_COLORS } from '@/data/horseColors'
import { ROUND_DISTANCES, TOTAL_HORSES, HORSES_PER_ROUND } from '@/config'

export interface RacingState {
  horses: Horse[]
  rounds: Round[]
}

const generateHorses = (): Horse[] => {
  const generatedHorses: Horse[] = []
  const usedNames = new Set<string>()
  const usedColors = new Set<string>()

  for (let i = 0; i < TOTAL_HORSES; i++) {
    let nameIndex = Math.floor(Math.random() * HORSE_NAMES.length)
    let name = HORSE_NAMES[nameIndex]
    if (!name) continue
    while (usedNames.has(name)) {
      nameIndex = Math.floor(Math.random() * HORSE_NAMES.length)
      name = HORSE_NAMES[nameIndex]
      if (!name) break
    }
    if (!name) continue
    usedNames.add(name)

    let colorIndex = Math.floor(Math.random() * HORSE_COLORS.length)
    let color = HORSE_COLORS[colorIndex]
    if (!color) continue
    while (usedColors.has(color)) {
      colorIndex = Math.floor(Math.random() * HORSE_COLORS.length)
      color = HORSE_COLORS[colorIndex]
      if (!color) break
    }
    if (!color) continue
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

const racingModule: Module<RacingState, unknown> = {
  namespaced: true,

  state: {
    horses: [],
    rounds: [],
  },

  mutations: {
    SET_HORSES(state: RacingState, horses: Horse[]) {
      state.horses = horses
    },

    SET_ROUNDS(state: RacingState, rounds: Round[]) {
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
      state: RacingState
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
    horses: (state: RacingState) => state.horses,
    rounds: (state: RacingState) => state.rounds,
  },
}

export default racingModule

