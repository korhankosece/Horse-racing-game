import { computed } from 'vue'
import { useStore } from 'vuex'
import type { Horse, Round } from '@/types'

export const useRacing = () => {
  const store = useStore()

  // Getters
  const horses = computed(() => store.getters['racing/horses'] as Horse[])
  const rounds = computed(() => store.getters['racing/rounds'] as Round[])

  // Actions
  const generateHorses = () => {
    return store.dispatch('racing/generateHorses')
  }

  const generateProgram = () => {
    return store.dispatch('racing/generateProgram')
  }

  return {
    // State
    horses,
    rounds,
    // Actions
    generateHorses,
    generateProgram,
  }
}

