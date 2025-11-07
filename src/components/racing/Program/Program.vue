<script setup lang="ts">
import { useRacing } from '@/composables'
import { getOrdinalSuffix } from '@/utils'
import { AppTable } from '@/components/common'
import type { AppTableColumn } from '@/components/common/AppTable/AppTable.props'

const { rounds } = useRacing()

const columns: AppTableColumn[] = [
  { key: 'position', label: 'Position' },
  { key: 'name', label: 'Name' },
]
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
            round.horses.map((horse: { name: string }, index: number) => ({
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
