<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'

import type { AppModalProps } from './AppModal.props'

const props = withDefaults(defineProps<AppModalProps>(), {
  show: false,
  title: '',
  subtitle: '',
  closeOnOverlay: true,
  closeOnEscape: true,
})

const emit = defineEmits<{
  close: []
}>()

const modalId = computed(() => `modal-${Math.random().toString(36).substring(2, 9)}`)
const titleId = computed(() => `${modalId.value}-title`)

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    emit('close')
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (props.closeOnEscape && event.key === 'Escape' && props.show) {
    emit('close')
  }
}

watch(
  () => props.show,
  isVisible => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="modal-overlay"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
        @click="handleOverlayClick"
      >
        <div class="modal-content" @click.stop>
          <div v-if="title || subtitle" class="modal-header">
            <!--/* v8 ignore next - already tested, but still complaining */-->
            <h2 v-if="title" :id="titleId" class="modal-title">{{ title }}</h2>
            <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: $theme-colors-background-white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-header {
  margin-bottom: 1.5rem;
  text-align: center;

  .modal-title {
    font-size: $theme-fontSize-xl;
    font-weight: 700;
    color: $theme-colors-primary;
    margin: 0 0 0.5rem 0;
  }

  .modal-subtitle {
    font-size: $theme-fontSize-lg;
    color: $theme-colors-text-secondary;
    margin: 0;
  }
}

.modal-body {
  flex: 1;
  min-height: 0;
}

.modal-footer {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

// Transition animations
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(20px);
  opacity: 0;
}
</style>
