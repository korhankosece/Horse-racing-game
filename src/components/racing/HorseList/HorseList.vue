<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { HORSE_NAMES } from '@/data/horseNames'
import { HORSE_COLORS } from '@/data/horseColors'
import { AppColorIndicator, AppTable } from '@/components/common'
import type { AppTableColumn } from '@/components/common/AppTable/AppTable.props'

interface Horse {
  id: string
  name: string
  condition: number
  color: string
}

const horses = ref<Horse[]>([])

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

const columns: AppTableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'condition', label: 'Condition' },
  { key: 'color', label: 'Color' },
]

const tableData = computed(() =>
  horses.value.map(horse => ({
    name: horse.name,
    condition: horse.condition,
    color: horse.color,
    horse,
  }))
)

onMounted(() => {
  horses.value = generateHorses()
})
</script>

<template>
  <div class="horse-list">
    <h2>Horse List (1-20)</h2>
    <div class="table-container">
      <AppTable :columns="columns" :data="tableData">
        <template #cell-color="{ value }">
          <AppColorIndicator :color="value as string" />
        </template>
      </AppTable>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.horse-list {
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
  }

  .table-container {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
