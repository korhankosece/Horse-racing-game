import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import AppButton from './AppButton.vue'

describe('AppButton', () => {
  it('should render button with default props', () => {
    const wrapper = mount(AppButton, {
      slots: {
        default: 'Click Me',
      },
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Click Me')
    expect(wrapper.find('button').classes()).toContain('app-button')
    expect(wrapper.find('button').classes()).toContain('app-button--primary')
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })

  it('should render with primary variant', () => {
    const wrapper = mount(AppButton, {
      props: {
        variant: 'primary',
      },
      slots: {
        default: 'Primary Button',
      },
    })

    expect(wrapper.find('button').classes()).toContain('app-button--primary')
  })

  it('should render with secondary variant', () => {
    const wrapper = mount(AppButton, {
      props: {
        variant: 'secondary',
      },
      slots: {
        default: 'Secondary Button',
      },
    })

    expect(wrapper.find('button').classes()).toContain('app-button--secondary')
  })

  it('should be disabled when disabled prop is true', () => {
    const wrapper = mount(AppButton, {
      props: {
        disabled: true,
      },
      slots: {
        default: 'Disabled Button',
      },
    })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('should render slot content', () => {
    const slotContent = 'Custom Button Text'
    const wrapper = mount(AppButton, {
      slots: {
        default: slotContent,
      },
    })

    expect(wrapper.find('button').text()).toBe(slotContent)
  })
})
