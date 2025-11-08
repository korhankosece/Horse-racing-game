<script setup lang="ts">
import { withDefaults } from 'vue'

import type { ColorIndicatorProps } from './AppColorIndicator.props'

const props = withDefaults(defineProps<ColorIndicatorProps>(), {
  size: 20,
})
</script>

<template>
  <span
    class="color-indicator"
    :style="{
      backgroundColor: props.color,
      width: `${props.size}px`,
      height: `${props.size}px`,
    }"
  ></span>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.color-indicator {
  display: inline-block;
  border-radius: 50%;
  border: 1px solid $theme-colors-border-light;
}
</style>
