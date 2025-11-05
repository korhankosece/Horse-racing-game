<script setup lang="ts">
// Component logic will be added
</script>

<template>
  <div class="race-track">
    <h2>1st Lap 1200m</h2>
    <div class="track-container">
      <div class="track">
        <div class="finish-line">FINISH</div>
        <!-- Lanes will be added here -->
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.race-track {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;

  h2 {
    margin-bottom: 1rem;
    font-size: $theme-fontSize-lg;
  }

  .track-container {
    flex: 1;
    overflow-x: auto;
  }

  .track {
    position: relative;
    min-width: 1100px;
    height: 100%;
    background-color: $theme-colors-background-lighter;
  }

  .finish-line {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: $theme-colors-border-dark;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $theme-fontSize-sm;
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
}
</style>
