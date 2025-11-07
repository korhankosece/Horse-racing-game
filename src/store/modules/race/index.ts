import type { Module } from 'vuex'
import type { RaceState, RootState } from './types'
import { initialState } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

const raceModule: Module<RaceState, RootState> = {
  namespaced: true,

  state: initialState,

  mutations,
  actions,
  getters,
}

export default raceModule
export type { RaceState, RaceStatus, ActionContext } from './types'
