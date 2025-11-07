import { createStore } from 'vuex'
import racingModule from './modules/racing'

export default createStore({
  modules: {
    racing: racingModule,
  },
})
