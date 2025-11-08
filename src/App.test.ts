import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import App from './App.vue'

describe('App', () => {
  it('should render AppLayout and RacingPage', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          AppLayout: {
            template: '<div data-test="app-layout"><slot /></div>',
          },
          RacingPage: {
            template: '<div data-test="racing-page"></div>',
          },
        },
      },
    })

    expect(wrapper.find('[data-test="app-layout"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="racing-page"]').exists()).toBe(true)
  })
})
