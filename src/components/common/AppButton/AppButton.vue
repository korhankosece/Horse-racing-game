<script setup lang="ts">
import { withDefaults } from 'vue'

import type { AppButtonProps } from './AppButton.props'

const props = withDefaults(defineProps<AppButtonProps>(), {
  variant: 'primary',
  disabled: false,
})
</script>

<template>
  <button :class="['app-button', `app-button--${props.variant}`]" :disabled="props.disabled">
    <slot />
  </button>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.app-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: $theme-fontSize-base;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--primary {
    background-color: $theme-colors-primary;
    color: $theme-colors-background-white;
  }

  &--secondary {
    background-color: $theme-colors-background-white;
    color: $theme-colors-secondary;
    border: 2px solid $theme-colors-secondary;
  }
}
</style>
