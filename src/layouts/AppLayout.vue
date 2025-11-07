<script setup lang="ts">
import { AppHeader } from '@/components/layout'
</script>

<template>
  <div class="app">
    <AppHeader />

    <main class="main-content">
      <slot />
    </main>
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

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
