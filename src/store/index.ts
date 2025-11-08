import { createStore } from 'vuex'

import raceModule from './modules/race'
import programModule from './modules/program/program'
import type { RootState } from './types'

export default createStore<RootState>({
  modules: {
    program: programModule,
    race: raceModule,
  },
})
