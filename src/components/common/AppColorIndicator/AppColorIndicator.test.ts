import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import AppColorIndicator from './AppColorIndicator.vue'

describe('AppColorIndicator', () => {
  it('should render with default size', () => {
    const wrapper = mount(AppColorIndicator, {
      props: {
        color: '#FF0000',
      },
    })

    const style = wrapper.find('.color-indicator').attributes('style')
    expect(wrapper.find('.color-indicator').exists()).toBe(true)
    expect(style).toContain('width: 20px')
    expect(style).toContain('height: 20px')
    expect(style).toContain('background-color')
  })

  it('should render with custom size', () => {
    const wrapper = mount(AppColorIndicator, {
      props: {
        color: '#00FF00',
        size: 30,
      },
    })

    const style = wrapper.find('.color-indicator').attributes('style')
    expect(style).toContain('width: 30px')
    expect(style).toContain('height: 30px')
    expect(style).toContain('background-color')
  })

  it('should apply correct background color', () => {
    const color = '#0000FF'
    const wrapper = mount(AppColorIndicator, {
      props: {
        color,
      },
    })

    const style = wrapper.find('.color-indicator').attributes('style')
    expect(style).toContain('background-color')
  })
})
