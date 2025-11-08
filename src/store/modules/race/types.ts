import type { RoundResult } from '@/types'
import type { RootState } from '../../types'

export type RaceStatus = 'idle' | 'running' | 'paused' | 'finished'

export interface RaceState {
  currentRound: number
  raceStatus: RaceStatus
  horsePositions: Record<string, number> // horseId -> position in pixels
  allRoundResults: RoundResult[]
  raceInterval: number | null
  showRoundTransition: boolean
  nextRoundNumber: number | null
}

export type { RootState }

export type ActionContext = {
  commit: (mutation: string, payload?: unknown) => void
  state: RaceState
  rootState: RootState
  dispatch: (action: string, payload?: unknown) => void
}
