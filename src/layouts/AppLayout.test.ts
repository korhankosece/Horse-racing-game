import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useStore } from 'vuex'

import { createTestStore } from '@/store/testing'

import AppLayout from './AppLayout.vue'

describe('AppLayout', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    vi.clearAllMocks()
    store = createTestStore()
    vi.mocked(useStore).mockReturnValue(store)
  })

  it('should render AppHeader component', () => {
    const wrapper = mount(AppLayout, {
      slots: {
        default: '<div>Test Content</div>',
      },
    })

    expect(wrapper.findComponent({ name: 'AppHeader' }).exists()).toBe(true)
  })

  it('should render slot content', () => {
    const slotContent = '<div class="test-slot">Test Content</div>'
    const wrapper = mount(AppLayout, {
      slots: {
        default: slotContent,
      },
    })

    expect(wrapper.find('.test-slot').exists()).toBe(true)
    expect(wrapper.find('.test-slot').text()).toBe('Test Content')
  })

  it('should render main content structure', () => {
    const wrapper = mount(AppLayout, {
      slots: {
        default: '<div>Test Content</div>',
      },
    })

    expect(wrapper.find('.app').exists()).toBe(true)
    expect(wrapper.find('.main-content').exists()).toBe(true)
  })
})
