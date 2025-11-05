<script setup lang="ts">
import HorseList from '@/components/features/HorseList/HorseList.vue'
import RaceTrack from '@/components/features/RaceTrack/RaceTrack.vue'
import Program from '@/components/features/Program/Program.vue'
import Results from '@/components/features/Results/Results.vue'
import AppButton from '@/components/common/AppButton/AppButton.vue'
</script>

<template>
  <div class="app">
    <header class="header">
      <AppButton variant="primary">GENERATE PROGRAM</AppButton>
      <AppButton variant="secondary">START / PAUSE</AppButton>
    </header>

    <div class="main-content">
      <div class="top-section">
        <HorseList />
        <RaceTrack />
      </div>

      <div class="bottom-section">
        <Program />
        <Results />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/styles/variables' as *;

.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: $theme-typography-fontFamily;
}

.header {
  padding: 1rem;
  background-color: $theme-colors-background-white;
  border-bottom: 1px solid $theme-colors-border-light;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-section {
  flex: 1;
  display: flex;
  border-bottom: 1px solid $theme-colors-border-light;

  .horse-list {
    width: 300px;
    border-right: 1px solid $theme-colors-border-light;
    background-color: $theme-colors-background-white;
  }

  .race-track {
    flex: 1;
    background-color: $theme-colors-background-white;
  }
}

.bottom-section {
  height: 300px;
  display: flex;
  border-top: 1px solid $theme-colors-border-light;

  .program,
  .results {
    flex: 1;
    background-color: $theme-colors-background-white;
  }

  .program {
    border-right: 1px solid $theme-colors-border-light;
  }
}
</style>
