<script setup lang="ts">
import type { AppTableProps } from './AppTable.props'
import { withDefaults } from 'vue'

const props = withDefaults(defineProps<AppTableProps>(), {
  stickyHeader: true,
})
</script>

<template>
  <div class="app-table-container">
    <table class="app-table">
      <thead :class="{ 'app-table__header--sticky': props.stickyHeader }">
        <tr>
          <th v-for="column in props.columns" :key="column.key" :style="{ width: column.width }">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in props.data" :key="index">
          <td v-for="column in props.columns" :key="column.key">
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.app-table-container {
  width: 100%;
  overflow-y: auto;
}

.app-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: $theme-colors-background-light;

    &.app-table__header--sticky {
      position: sticky;
      top: 0;
    }
  }

  th,
  td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid $theme-colors-border-light;
  }

  th {
    font-weight: 600;
  }
}
</style>
