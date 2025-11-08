import { computed } from 'vue'
import { useStore } from 'vuex'

import type { RaceStatus } from '@/store/modules/race'
import type { Horse, RoundResult } from '@/types'

export const useRace = () => {
  const store = useStore()

  // Getters
  const currentRound = computed(() => store.getters['race/currentRound'] as number)
  const raceStatus = computed(() => store.getters['race/raceStatus'] as RaceStatus)
  const horsePositions = computed(() => store.getters['race/horsePositions'] as Record<string, number>)
  const currentRoundResults = computed(
    () => store.getters['race/currentRoundResults'] as Array<{ position: number; horse: Horse }>
  )
  const allRoundResults = computed(() => store.getters['race/allRoundResults'] as RoundResult[])
  const showRoundTransition = computed(() => store.getters['race/showRoundTransition'] as boolean)
  const nextRoundNumber = computed(() => store.getters['race/nextRoundNumber'] as number | null)

  // Actions
  const startRace = () => store.dispatch('race/startRace')

  const pauseRace = () => store.dispatch('race/pauseRace')

  const resumeRace = () => store.dispatch('race/resumeRace')

  const stopRace = () => store.dispatch('race/stopRace')

  const startNextRound = () => store.dispatch('race/startNextRound')

  return {
    // State
    currentRound,
    raceStatus,
    horsePositions,
    currentRoundResults,
    allRoundResults,
    showRoundTransition,
    nextRoundNumber,
    // Actions
    startRace,
    pauseRace,
    resumeRace,
    stopRace,
    startNextRound,
  }
}
