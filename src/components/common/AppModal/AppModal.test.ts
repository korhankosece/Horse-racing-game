import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import AppModal from './AppModal.vue'

describe('AppModal', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
    document.body.innerHTML = ''
  })

  const waitForTeleport = async () => {
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
  }

  const getModalElement = (selector: string) => document.querySelector(selector)

  it('should not render when show is false', () => {
    mount(AppModal, { props: { show: false } })

    expect(getModalElement('.modal-overlay')).toBeNull()
  })

  it('should render when show is true', async () => {
    mount(AppModal, { props: { show: true } })

    await waitForTeleport()

    expect(getModalElement('.modal-overlay')).toBeTruthy()
  })

  it('should render title and subtitle when provided', async () => {
    mount(AppModal, {
      props: {
        show: true,
        title: 'Test Title',
        subtitle: 'Test Subtitle',
      },
    })

    await waitForTeleport()

    const title = getModalElement('.modal-title')
    expect(title?.textContent).toBe('Test Title')
    expect(title?.getAttribute('id')).toContain('-title')
    expect(getModalElement('.modal-subtitle')?.textContent).toBe('Test Subtitle')
  })

  it('should render slot content', async () => {
    const slotContent = 'Modal Body Content'
    mount(AppModal, {
      props: { show: true },
      slots: { default: slotContent },
    })

    await waitForTeleport()

    expect(getModalElement('.modal-body')?.textContent).toBe(slotContent)
  })

  it('should render footer slot when provided', async () => {
    const footerContent = 'Footer Content'
    mount(AppModal, {
      props: { show: true },
      slots: { footer: footerContent },
    })

    await waitForTeleport()

    expect(getModalElement('.modal-footer')?.textContent).toBe(footerContent)
  })

  it('should emit close when overlay is clicked and closeOnOverlay is true', async () => {
    const wrapper = mount(AppModal, {
      props: { show: true, closeOnOverlay: true },
    })

    await waitForTeleport()

    const overlay = getModalElement('.modal-overlay') as HTMLElement
    overlay?.click()
    await nextTick()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('should not emit close when overlay is clicked and closeOnOverlay is false', async () => {
    const wrapper = mount(AppModal, {
      props: { show: true, closeOnOverlay: false },
    })

    await waitForTeleport()

    const overlay = getModalElement('.modal-overlay') as HTMLElement
    overlay?.click()
    await nextTick()

    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('should not emit close when modal content is clicked', async () => {
    const wrapper = mount(AppModal, {
      props: { show: true, closeOnOverlay: true },
    })

    await waitForTeleport()

    const content = getModalElement('.modal-content') as HTMLElement
    content?.click()
    await nextTick()

    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('should emit close when Escape key is pressed and closeOnEscape is true', async () => {
    const wrapper = mount(AppModal, {
      props: { show: true, closeOnEscape: true },
    })

    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('should not emit close when Escape key is pressed and closeOnEscape is false', async () => {
    const wrapper = mount(AppModal, {
      props: { show: true, closeOnEscape: false },
    })

    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('should lock and unlock body scroll', async () => {
    const wrapper = mount(AppModal, { props: { show: true } })

    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    await wrapper.setProps({ show: false })
    await nextTick()
    expect(document.body.style.overflow).toBe('')

    wrapper.unmount()
    await nextTick()
    expect(document.body.style.overflow).toBe('')
  })

  it('should have correct ARIA attributes', async () => {
    mount(AppModal, {
      props: { show: true, title: 'Test Title' },
    })

    await waitForTeleport()

    const overlay = getModalElement('.modal-overlay')
    const title = getModalElement('.modal-title')
    const titleId = title?.getAttribute('id')

    expect(overlay?.getAttribute('role')).toBe('dialog')
    expect(overlay?.getAttribute('aria-modal')).toBe('true')
    expect(overlay?.getAttribute('aria-labelledby')).toBe(titleId)
    expect(titleId).toContain('-title')
  })

  it('should not have aria-labelledby when title is not provided', async () => {
    mount(AppModal, { props: { show: true } })

    await waitForTeleport()

    expect(getModalElement('.modal-overlay')?.getAttribute('aria-labelledby')).toBeNull()
  })
})
