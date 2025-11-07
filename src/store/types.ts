import type { ProgramState } from './modules/program/program'
import type { RaceState } from './modules/race/types'

export interface RootState {
  program: ProgramState
  race: RaceState
}
