import { createStore } from 'vuex'
import programModule from './modules/program'
import raceModule from './modules/race'

export default createStore({
  modules: {
    program: programModule,
    race: raceModule,
  },
})
