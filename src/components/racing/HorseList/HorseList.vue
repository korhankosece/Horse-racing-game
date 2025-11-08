<script setup lang="ts">
import { computed } from 'vue'

import { AppColorIndicator, AppTable } from '@/components/common'
import type { AppTableColumn } from '@/components/common/AppTable/AppTable.props'
import { useProgram } from '@/composables'

const { horses } = useProgram()

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
