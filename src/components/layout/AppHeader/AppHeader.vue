<script setup lang="ts">
import { computed } from 'vue'

import { AppButton } from '@/components/common'
import { useProgram, useRace } from '@/composables'

const { generateProgram, rounds } = useProgram()
const { raceStatus, startRace, pauseRace, resumeRace } = useRace()

const handleGenerateProgram = () => {
  generateProgram()
}

const isProgramButtonDisabled = computed(
  () => raceStatus.value === 'running' || raceStatus.value === 'paused'
)

const isRaceButtonDisabled = computed(() => rounds.value.length === 0)

const buttonText = computed(() => {
  switch (raceStatus.value) {
    case 'idle':
    case 'finished':
      return 'START RACE'
    case 'running':
      return 'PAUSE RACE'
    case 'paused':
      return 'RESUME RACE'
    default:
      return 'START RACE'
  }
})

const handleRaceControl = () => {
  if (raceStatus.value === 'idle' || raceStatus.value === 'finished') {
    startRace()
  } else if (raceStatus.value === 'running') {
    pauseRace()
  } else if (raceStatus.value === 'paused') {
    resumeRace()
  }
}
</script>

<template>
  <header class="header">
    <h1 class="header-title">Horse Racing Game</h1>
    <div class="header-actions">
      <AppButton
        variant="primary"
        :disabled="isProgramButtonDisabled"
        aria-label="Generate race program"
        @click="handleGenerateProgram"
      >
        GENERATE PROGRAM
      </AppButton>
      <AppButton
        variant="secondary"
        :disabled="isRaceButtonDisabled"
        :aria-label="buttonText"
        @click="handleRaceControl"
      >
        {{ buttonText }}
      </AppButton>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.header {
  padding: 1rem 1.5rem;
  border-bottom: 2px solid $theme-colors-primary;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, $theme-colors-primary 0%, $theme-colors-secondary 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .header-title {
    margin: 0;
    font-size: $theme-fontSize-xl;
    font-weight: 700;
    color: $theme-colors-background-white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }
}
</style>
