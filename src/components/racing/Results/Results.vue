<script setup lang="ts">
import { ref } from 'vue'
import type { RoundResult } from '@/types'
import { getOrdinalSuffix } from '@/utils'
import { AppTable } from '@/components/common'
import type { AppTableColumn } from '@/components/common/AppTable/AppTable.props'

const results = ref<RoundResult[]>([])

const columns: AppTableColumn[] = [
  { key: 'position', label: 'Position' },
  { key: 'name', label: 'Name' },
]

// Results will be populated when race finishes
// For now, keep empty array
</script>

<template>
  <div class="results">
    <h2>Results</h2>
    <div class="results-content">
      <div v-for="result in results" :key="result.number" class="round-section">
        <h3 class="round-title">
          {{ getOrdinalSuffix(result.number) }} Lap - {{ result.distance }}m
        </h3>
        <AppTable
          :columns="columns"
          :data="
            result.horses.map((item: { position: number; horse: { name: string } }) => ({
              position: item.position,
              name: item.horse.name,
            }))
          "
        />
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
