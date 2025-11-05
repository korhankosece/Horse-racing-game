<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { HORSE_NAMES } from '@/data/horseNames'
import { HORSE_COLORS } from '@/data/horseColors'
import { ROUND_DISTANCES } from '@/config'
import { AppTable } from '@/components/common'
import type { AppTableColumn } from '@/components/common/AppTable/AppTable.props'

interface Horse {
  id: string
  name: string
  condition: number
  color: string
}

interface Round {
  number: number
  distance: number
  horses: Horse[]
}

const rounds = ref<Round[]>([])

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

const getOrdinalSuffix = (num: number): string => {
  const j = num % 10
  const k = num % 100
  if (j === 1 && k !== 11) return `${num}st`
  if (j === 2 && k !== 12) return `${num}nd`
  if (j === 3 && k !== 13) return `${num}rd`
  return `${num}th`
}

const generateSchedule = (horses: Horse[]): Round[] => {
  const generatedRounds: Round[] = []

  ROUND_DISTANCES.forEach((distance, index) => {
    const shuffled = [...horses].sort(() => Math.random() - 0.5)
    const selectedHorses = shuffled.slice(0, 10)

    generatedRounds.push({
      number: index + 1,
      distance,
      horses: selectedHorses,
    })
  })

  return generatedRounds
}

const columns: AppTableColumn[] = [
  { key: 'position', label: 'Position' },
  { key: 'name', label: 'Name' },
]

onMounted(() => {
  const horses = generateHorses()
  rounds.value = generateSchedule(horses)
})
</script>

<template>
  <div class="program">
    <h2>Program</h2>
    <div class="program-content">
      <div v-for="round in rounds" :key="round.number" class="round-section">
        <h3 class="round-title">
          {{ getOrdinalSuffix(round.number) }} Lap - {{ round.distance }}m
        </h3>
        <AppTable
          :columns="columns"
          :data="
            round.horses.map((horse, index) => ({
              position: index + 1,
              name: horse.name,
            }))
          "
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.program {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem;
  background-color: $theme-colors-background-white;
  min-height: 0;
  overflow: hidden;

  h2 {
    margin-bottom: 0.5rem;
    font-size: $theme-fontSize-lg;
    color: $theme-colors-primary;
  }

  .program-content {
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    gap: 1rem;
    padding-bottom: 1rem;
  }

  .round-section {
    min-width: 200px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    .round-title {
      margin-bottom: 0.5rem;
      font-size: $theme-fontSize-sm;
      font-weight: 600;
      color: $theme-colors-primary;
    }
  }
}
</style>
