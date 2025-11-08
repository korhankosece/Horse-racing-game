import { ref } from 'vue'
import { vi } from 'vitest'

import { useProgram, useRace } from '@/composables'

export const createMockUseProgram = (
  overrides?: Partial<ReturnType<typeof useProgram>>
): ReturnType<typeof useProgram> => ({
  generateHorses: vi.fn(),
  horses: ref([]) as unknown as ReturnType<typeof useProgram>['horses'],
  rounds: ref([]) as unknown as ReturnType<typeof useProgram>['rounds'],
  generateProgram: vi.fn(),
  ...overrides,
} as ReturnType<typeof useProgram>)

export const createMockUseRace = (
  overrides?: Partial<ReturnType<typeof useRace>>
): ReturnType<typeof useRace> => ({
  showRoundTransition: ref(false) as unknown as ReturnType<typeof useRace>['showRoundTransition'],
  currentRound: ref(1) as unknown as ReturnType<typeof useRace>['currentRound'],
  raceStatus: ref('idle') as unknown as ReturnType<typeof useRace>['raceStatus'],
  horsePositions: ref({}) as unknown as ReturnType<typeof useRace>['horsePositions'],
  currentRoundResults: ref([]) as unknown as ReturnType<typeof useRace>['currentRoundResults'],
  allRoundResults: ref([]) as unknown as ReturnType<typeof useRace>['allRoundResults'],
  nextRoundNumber: ref(null) as unknown as ReturnType<typeof useRace>['nextRoundNumber'],
  startRace: vi.fn(),
  pauseRace: vi.fn(),
  resumeRace: vi.fn(),
  stopRace: vi.fn(),
  startNextRound: vi.fn(),
  ...overrides,
} as ReturnType<typeof useRace>)
