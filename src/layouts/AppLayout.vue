<script setup lang="ts">
import { AppButton } from '@/components/common'
import { useRacing } from '@/composables'

const { generateProgram } = useRacing()

const handleGenerateProgram = () => {
  generateProgram()
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="header-title">Horse Racing Game</h1>
      <div class="header-actions">
        <AppButton variant="primary" @click="handleGenerateProgram">GENERATE PROGRAM</AppButton>
        <AppButton variant="secondary">START / PAUSE</AppButton>
      </div>
    </header>

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

.header {
  padding: 1rem 1.5rem;
  border-bottom: 2px solid $theme-colors-primary;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, $theme-colors-primary 0%, $theme-colors-secondary 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .header-title {
    margin: 0;
    font-size: $theme-fontSize-xl;
    font-weight: 700;
    color: $theme-colors-background-white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
