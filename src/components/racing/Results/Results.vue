<script setup lang="ts">
// Component logic will be added
</script>

<template>
  <div class="results">
    <h2>Results</h2>
    <div class="results-content">
      <!-- Results will be added here -->
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.results {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $theme-colors-background-white;
  min-height: 0;
  overflow: hidden;

  h2 {
    margin-bottom: 1rem;
    font-size: $theme-fontSize-lg;
    color: $theme-colors-secondary;
  }

  .results-content {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
