import { createStore } from 'vuex'
import type { RootState } from '../types'
import programModule from '../modules/program/program'
import raceModule from '../modules/race'
import type { ProgramState } from '../modules/program/program'
import type { RaceState } from '../modules/race/types'

export interface TestStoreOptions {
  programState?: Partial<ProgramState>
  raceState?: Partial<RaceState>
}

export const createTestStore = (options: TestStoreOptions = {}) => {
  const store = createStore<RootState>({
    modules: {
      program: {
        ...programModule,
        state: (): ProgramState => ({
          horses: [],
          rounds: [],
          ...(options.programState || {}),
        }),
      },
      race: {
        ...raceModule,
        state: (): RaceState => ({
          currentRound: 1,
          raceStatus: 'idle',
          horsePositions: {},
          allRoundResults: [],
          raceInterval: null,
          showRoundTransition: false,
          nextRoundNumber: null,
          ...(options.raceState || {}),
        }),
      },
    },
  })

  return store
}
