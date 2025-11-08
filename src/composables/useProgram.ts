import { computed } from 'vue'
import { useStore } from 'vuex'

import type { Horse, Round } from '@/types'

export const useProgram = () => {
  const store = useStore()

  const horses = computed(() => store.getters['program/horses'] as Horse[])
  const rounds = computed(() => store.getters['program/rounds'] as Round[])

  const generateHorses = () => store.dispatch('program/generateHorses')

  const generateProgram = () => {
    store.dispatch('program/generateProgram')
    // Reset race when program is generated
    store.dispatch('race/stopRace')
  }

  return {
    horses,
    rounds,
    generateHorses,
    generateProgram,
  }
}
