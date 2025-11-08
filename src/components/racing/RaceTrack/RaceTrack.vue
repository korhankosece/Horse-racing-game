<script setup lang="ts">
import { computed } from 'vue'
import { RACE_CONFIG } from '@/config'
import { useProgram, useRace } from '@/composables'
import { getOrdinalSuffix } from '@/utils'
import HorseIcon from '@/components/racing/HorseIcon'

const { rounds } = useProgram()
const { currentRound, horsePositions } = useRace()

const hasRounds = computed(() => rounds.value.length > 0)

const currentRoundData = computed(() => rounds.value.find(r => r.number === currentRound.value))

const currentRoundHorses = computed(() =>
  currentRoundData.value ? currentRoundData.value.horses : []
)

const currentDistance = computed(() =>
  currentRoundData.value ? currentRoundData.value.distance : 1200
)

const trackLength = computed(
  () =>
    (RACE_CONFIG.trackLengths[currentDistance.value as keyof typeof RACE_CONFIG.trackLengths] ||
      600) + 48
)
</script>

<template>
  <div class="race-track">
    <template v-if="hasRounds">
      <h2>{{ getOrdinalSuffix(currentRound) }} Lap {{ currentDistance }}m</h2>
      <div class="track-container">
        <div class="track" :style="{ width: `${trackLength}px` }">
          <div
            v-for="(horse, index) in currentRoundHorses"
            :key="horse.id"
            class="lane"
            :style="{ top: `${index * 10}%` }"
          >
            <div class="lane-number">{{ index + 1 }}</div>
            <div
              class="horse-container"
              :style="{ left: `${(horsePositions[horse.id] || 0) + 48}px` }"
            >
              <HorseIcon :color="horse.color" :size="60" />
            </div>
          </div>
          <div class="finish-line">FINISH</div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="empty-state">
        <div class="empty-state-content">
          <h2>No Race Program</h2>
          <p>Please generate a program to start the race.</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.race-track {
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: $theme-colors-background-white;
  min-height: 0;
  overflow: hidden;

  h2 {
    margin-bottom: 1rem;
    font-size: $theme-fontSize-lg;
    padding: 0.5rem 1rem 0;
  }

  .track-container {
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.5rem 1rem 8px 1rem;
    scrollbar-gutter: stable;
  }

  .track-container::-webkit-scrollbar {
    height: 8px;
  }

  .track-container::-webkit-scrollbar-track {
    background: $theme-colors-background-light;
  }

  .track-container::-webkit-scrollbar-thumb {
    background: $theme-colors-border-light;
    border-radius: 4px;
  }

  .track-container::-webkit-scrollbar-thumb:hover {
    background: $theme-colors-text-secondary;
  }

  .track {
    position: relative;
    height: calc(100% - 8px);
    background-color: $theme-colors-background-lighter;
  }

  .lane {
    position: absolute;
    left: 0;
    right: 0;
    height: 10%;
    border-bottom: 1px solid $theme-colors-border-light;
    display: flex;
    align-items: center;

    .lane-number {
      position: absolute;
      left: 0.5rem;
      font-size: $theme-fontSize-lg;
      font-weight: 600;
      color: $theme-colors-text-secondary;
      z-index: 1;
      width: 2.5rem;
      text-align: center;
    }

    .horse-container {
      position: absolute;
      transition: left 0.1s linear;
      z-index: 2;
    }
  }

  .empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $theme-colors-background-lighter;

    .empty-state-content {
      text-align: center;
      color: $theme-colors-text-secondary;

      h2 {
        font-size: $theme-fontSize-xl;
        margin: 0 0 0.5rem 0;
        color: $theme-colors-text-primary;
        font-weight: 600;
      }

      p {
        font-size: $theme-fontSize-base;
        margin: 0;
      }
    }
  }

  .finish-line {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 1.5px;
    background-color: $theme-colors-border-dark;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $theme-fontSize-base;
    font-weight: 700;
    color: $theme-colors-text-primary;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    z-index: 10;
    pointer-events: none;
    letter-spacing: 0.1em;
  }
}
</style>
