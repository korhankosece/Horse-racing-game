import { createStore } from 'vuex'
import programModule from './modules/program/program'
import raceModule from './modules/race'
import type { RootState } from './types'

export default createStore<RootState>({
  modules: {
    program: programModule,
    race: raceModule,
  },
})
