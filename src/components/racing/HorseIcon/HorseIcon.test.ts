import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import HorseIcon from './HorseIcon.vue'

describe('HorseIcon', () => {
  it('should render SVG with default size', () => {
    const wrapper = mount(HorseIcon, {
      props: {
        color: '#FF0000',
      },
    })

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('width')).toBe('40')
    expect(svg.attributes('height')).toBe('40')
    expect(svg.attributes('viewBox')).toBe('0 0 219.175 219.175')
    expect(svg.classes()).toContain('horse-icon')
  })

  it('should render SVG with custom size', () => {
    const wrapper = mount(HorseIcon, {
      props: {
        color: '#00FF00',
        size: 60,
      },
    })

    const svg = wrapper.find('svg')
    expect(svg.attributes('width')).toBe('60')
    expect(svg.attributes('height')).toBe('60')
  })

  it('should apply color to path fill', () => {
    const color = '#0000FF'
    const wrapper = mount(HorseIcon, {
      props: {
        color,
      },
    })

    const path = wrapper.find('path')
    expect(path.attributes('fill')).toBe(color)
  })
})
