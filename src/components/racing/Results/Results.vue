<script setup lang="ts">
import { computed } from 'vue'

import { AppTable } from '@/components/common'
import type { AppTableColumn } from '@/components/common/AppTable/AppTable.props'
import { useRace } from '@/composables'
import { getOrdinalSuffix } from '@/utils'

const { allRoundResults } = useRace()

const columns: AppTableColumn[] = [
  { key: 'position', label: 'Position' },
  { key: 'name', label: 'Name' },
]

const roundTableDataMap = computed(() => {
  const map = new Map<number, Array<{ position: number; name: string }>>()
  allRoundResults.value.forEach(result => {
    map.set(
      result.number,
      result.horses.map(item => ({
        position: item.position,
        name: item.horse.name,
      }))
    )
  })
  return map
})
</script>

<template>
  <div class="results">
    <h2>Results</h2>
    <div class="results-content">
      <div v-for="result in allRoundResults" :key="result.number" class="round-section">
        <h3 class="round-title">
          {{ getOrdinalSuffix(result.number) }} Lap - {{ result.distance }}m
        </h3>
        <AppTable :columns="columns" :data="roundTableDataMap.get(result.number)!" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.results {
  padding: 0.5rem 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $theme-colors-background-white;
  min-height: 0;
  overflow: hidden;

  h2 {
    margin-bottom: 0.5rem;
    font-size: $theme-fontSize-lg;
    color: $theme-colors-secondary;
  }

  .results-content {
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
      color: $theme-colors-secondary;
    }
  }
}
</style>
