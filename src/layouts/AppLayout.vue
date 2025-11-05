<script setup lang="ts">
import { HorseList, RaceTrack, Program, Results } from '@/components/racing'
import { AppButton } from '@/components/common'
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
  border-bottom: 1px solid $theme-colors-border-light;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  background-color: $theme-colors-background-white;
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
  min-height: 0;
  overflow: hidden;

  > :first-child {
    width: 300px;
    border-right: 1px solid $theme-colors-border-light;
  }
}

.bottom-section {
  height: 300px;
  display: flex;
  border-top: 1px solid $theme-colors-border-light;

  > * {
    flex: 1;
  }

  > :first-child {
    border-right: 1px solid $theme-colors-border-light;
  }
}
</style>
