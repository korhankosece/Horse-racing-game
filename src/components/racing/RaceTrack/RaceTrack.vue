<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { HORSE_NAMES } from '@/data/horseNames'
import { HORSE_COLORS } from '@/data/horseColors'
import { ROUND_DISTANCES, RACE_CONFIG } from '@/config'
import HorseIcon from '@/components/racing/HorseIcon'

interface Horse {
  id: string
  name: string
  condition: number
  color: string
}

const currentRound = ref(1)
const currentRoundHorses = ref<Horse[]>([])

const getOrdinalSuffix = (num: number): string => {
  const j = num % 10
  const k = num % 100
  if (j === 1 && k !== 11) return `${num}st`
  if (j === 2 && k !== 12) return `${num}nd`
  if (j === 3 && k !== 13) return `${num}rd`
  return `${num}th`
}

const generateHorses = (): Horse[] => {
  const generatedHorses: Horse[] = []
  const usedNames = new Set<string>()
  const usedColors = new Set<string>()

  for (let i = 0; i < 20; i++) {
    let nameIndex = Math.floor(Math.random() * HORSE_NAMES.length)
    let name = HORSE_NAMES[nameIndex]
    if (!name) continue
    while (usedNames.has(name)) {
      nameIndex = Math.floor(Math.random() * HORSE_NAMES.length)
      name = HORSE_NAMES[nameIndex]
      if (!name) break
    }
    if (!name) continue
    usedNames.add(name)

    let colorIndex = Math.floor(Math.random() * HORSE_COLORS.length)
    let color = HORSE_COLORS[colorIndex]
    if (!color) continue
    while (usedColors.has(color)) {
      colorIndex = Math.floor(Math.random() * HORSE_COLORS.length)
      color = HORSE_COLORS[colorIndex]
      if (!color) break
    }
    if (!color) continue
    usedColors.add(color)

    generatedHorses.push({
      id: `horse-${i + 1}`,
      name,
      condition: Math.floor(Math.random() * 100) + 1,
      color,
    })
  }

  return generatedHorses
}

const currentDistance = computed(() => ROUND_DISTANCES[currentRound.value - 1] || 1200)
const trackLength = computed(
  () =>
    RACE_CONFIG.trackLengths[currentDistance.value as keyof typeof RACE_CONFIG.trackLengths] || 600
)

onMounted(() => {
  const horses = generateHorses()
  const shuffled = [...horses].sort(() => Math.random() - 0.5)
  currentRoundHorses.value = shuffled.slice(0, 10)
})
</script>

<template>
  <div class="race-track">
    <h2>{{ getOrdinalSuffix(currentRound) }} Lap {{ currentDistance }}m</h2>
    <div class="track-container">
      <div class="track" :style="{ width: `${trackLength * 1.3}px` }">
        <div
          v-for="(horse, index) in currentRoundHorses"
          :key="horse.id"
          class="lane"
          :style="{ top: `${index * 10}%` }"
        >
          <div class="lane-number">{{ index + 1 }}</div>
          <div class="horse-container">
            <HorseIcon :color="horse.color" :size="60" />
          </div>
        </div>
        <div class="finish-line">FINISH</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.race-track {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: $theme-colors-background-white;
  min-height: 0;
  overflow: hidden;

  h2 {
    margin-bottom: 1rem;
    font-size: $theme-fontSize-lg;
  }

  .track-container {
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 8px;
    padding-right: 8px;
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
      left: 3rem;
      transition: left 0.1s linear;
      z-index: 2;
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
