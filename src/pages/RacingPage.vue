<script setup lang="ts">
import { onMounted } from 'vue'

import { HorseList, Program, RaceTrack, Results, RoundTransitionModal } from '@/components/racing'
import { useProgram, useRace } from '@/composables'

const { generateHorses, horses } = useProgram()
const { showRoundTransition } = useRace()

onMounted(() => {
  // Initialize horses once when page loads
  if (horses.value.length === 0) {
    generateHorses()
  }
})
</script>

<template>
  <div class="racing-page">
    <div class="top-section">
      <HorseList />
      <RaceTrack />
    </div>

    <div class="bottom-section">
      <Program />
      <Results />
    </div>

    <RoundTransitionModal v-if="showRoundTransition" />
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.racing-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-section {
  flex: 1;
  display: flex;
  border-bottom: 1px solid $theme-colors-border-light;
  min-height: 0;
  overflow: hidden;

  > :first-child {
    width: 340px;
    border-right: 1px solid $theme-colors-border-light;
  }
}

.bottom-section {
  height: 300px;
  display: flex;
  border-top: 1px solid $theme-colors-border-light;

  > * {
    flex: 1;
  }

  > :first-child {
    border-right: 1px solid $theme-colors-border-light;
  }
}
</style>
