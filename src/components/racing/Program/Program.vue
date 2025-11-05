<script setup lang="ts">
// Component logic will be added
</script>

<template>
  <div class="program">
    <h2>Program</h2>
    <div class="program-content">
      <!-- Program rounds will be added here -->
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.program {
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
    color: $theme-colors-primary;
  }

  .program-content {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
