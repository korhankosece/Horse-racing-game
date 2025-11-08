<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'

import { AppButton, AppModal } from '@/components/common'
import { useProgram, useRace } from '@/composables'
import { getOrdinalSuffix } from '@/utils'

const { showRoundTransition, nextRoundNumber, startNextRound } = useRace()
const { rounds } = useProgram()

const countdown = ref(3)
let countdownInterval: number | null = null

const nextRoundData = computed(() => {
  if (!nextRoundNumber.value) return null
  return rounds.value.find(r => r.number === nextRoundNumber.value)
})

const modalTitle = computed(() => {
  if (!nextRoundNumber.value) return ''
  return `Round ${nextRoundNumber.value} Starting`
})

const modalSubtitle = computed(() => {
  if (!nextRoundData.value || !nextRoundNumber.value) return ''
  return `${getOrdinalSuffix(nextRoundNumber.value)} Lap - ${nextRoundData.value.distance}m`
})

const startCountdown = () => {
  countdown.value = 3
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
      startNextRound()
    }
  }, 1000) as unknown as number
}

const handleSkip = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  startNextRound()
}

watch(
  () => nextRoundNumber.value,
  newValue => {
    if (newValue) {
      startCountdown()
    } else {
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<template>
  <AppModal
    :show="showRoundTransition && !!nextRoundNumber && !!nextRoundData"
    :title="modalTitle"
    :subtitle="modalSubtitle"
    :close-on-overlay="false"
    :close-on-escape="false"
  >
    <div class="countdown-container">
      <div class="countdown-number">{{ countdown }}</div>
      <p class="countdown-text">Get ready!</p>
    </div>

    <template #footer>
      <AppButton variant="primary" @click="handleSkip">Skip</AppButton>
    </template>
  </AppModal>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.countdown-container {
  margin: 2rem 0;
  text-align: center;

  .countdown-number {
    font-size: 5rem;
    font-weight: 700;
    color: $theme-colors-primary;
    line-height: 1;
    margin-bottom: 0.5rem;
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  .countdown-text {
    font-size: $theme-fontSize-lg;
    color: $theme-colors-text-secondary;
    margin: 0;
  }
}
</style>
