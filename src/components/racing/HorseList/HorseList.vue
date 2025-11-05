<script setup lang="ts">
// Component logic will be added
</script>

<template>
  <div class="horse-list">
    <h2>Horse List (1-20)</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          <!-- Dummy data will be replaced -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.horse-list {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;

  h2 {
    margin-bottom: 1rem;
    font-size: $theme-fontSize-lg;
  }

  .table-container {
    flex: 1;
    overflow-y: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background-color: $theme-colors-background-light;
      position: sticky;
      top: 0;
    }

    th,
    td {
      padding: 0.5rem;
      text-align: left;
      border-bottom: 1px solid $theme-colors-border-light;
    }
  }
}
</style>
