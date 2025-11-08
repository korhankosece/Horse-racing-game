import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, ref } from 'vue'

import { createMockUseProgram, createMockUseRace } from '@/composables/testing'
import { useProgram, useRace } from '@/composables'
import { createMockRound } from '@/store/testing'

import RoundTransitionModal from './RoundTransitionModal.vue'

vi.mock('@/composables', () => ({
  useProgram: vi.fn(),
  useRace: vi.fn(),
}))

describe('RoundTransitionModal', () => {
  const mockUseProgram = vi.mocked(useProgram)
  const mockUseRace = vi.mocked(useRace)

  const appModalStub = {
    template: '<div><slot /><slot name="footer" /></div>',
    props: ['show', 'title', 'subtitle', 'closeOnOverlay', 'closeOnEscape'],
  }

  const mountWithStubs = (options = {}) =>
    mount(RoundTransitionModal, {
      global: {
        stubs: {
          AppModal: appModalStub,
        },
      },
      ...options,
    })

  const setupMockRounds = (rounds = [createMockRound({ number: 2, distance: 1500 })]) => {
    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        rounds: computed(() => rounds) as unknown as ReturnType<typeof useProgram>['rounds'],
      })
    )
  }

  const setupMockRace = (overrides = {}) => {
    mockUseRace.mockReturnValue(
      createMockUseRace({
        showRoundTransition: computed(() => true) as unknown as ReturnType<
          typeof useRace
        >['showRoundTransition'],
        nextRoundNumber: computed(() => 2) as unknown as ReturnType<typeof useRace>['nextRoundNumber'],
        ...overrides,
      })
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    mockUseProgram.mockReturnValue(createMockUseProgram())
    mockUseRace.mockReturnValue(createMockUseRace())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should not render modal when showRoundTransition is false', () => {
    mockUseRace.mockReturnValue(
      createMockUseRace({
        showRoundTransition: computed(() => false) as unknown as ReturnType<
          typeof useRace
        >['showRoundTransition'],
        nextRoundNumber: computed(() => null) as unknown as ReturnType<typeof useRace>['nextRoundNumber'],
      })
    )

    const wrapper = mount(RoundTransitionModal)

    const modal = wrapper.findComponent({ name: 'AppModal' })
    expect(modal.props('show')).toBe(false)
  })

  it('should not render modal when nextRoundNumber is null', () => {
    mockUseRace.mockReturnValue(
      createMockUseRace({
        showRoundTransition: computed(() => true) as unknown as ReturnType<
          typeof useRace
        >['showRoundTransition'],
        nextRoundNumber: computed(() => null) as unknown as ReturnType<typeof useRace>['nextRoundNumber'],
      })
    )

    const wrapper = mount(RoundTransitionModal)

    const modal = wrapper.findComponent({ name: 'AppModal' })
    expect(modal.props('show')).toBe(false)
  })

  it('should not render modal when nextRoundData is not found', () => {
    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        rounds: computed(() => []) as unknown as ReturnType<typeof useProgram>['rounds'],
      })
    )
    mockUseRace.mockReturnValue(
      createMockUseRace({
        showRoundTransition: computed(() => true) as unknown as ReturnType<
          typeof useRace
        >['showRoundTransition'],
        nextRoundNumber: computed(() => 2) as unknown as ReturnType<typeof useRace>['nextRoundNumber'],
      })
    )

    const wrapper = mount(RoundTransitionModal)

    const modal = wrapper.findComponent({ name: 'AppModal' })
    expect(modal.props('show')).toBe(false)
  })

  it('should render modal with correct title and subtitle', () => {
    setupMockRounds()
    setupMockRace()

    const wrapper = mount(RoundTransitionModal)

    const modal = wrapper.findComponent({ name: 'AppModal' })
    expect(modal.props('show')).toBe(true)
    expect(modal.props('title')).toBe('Round 2 Starting')
    expect(modal.props('subtitle')).toBe('2nd Lap - 1500m')
    expect(modal.props('closeOnOverlay')).toBe(false)
    expect(modal.props('closeOnEscape')).toBe(false)
  })

  it('should display countdown starting from 3', () => {
    setupMockRounds()
    setupMockRace()

    const wrapper = mountWithStubs()

    expect(wrapper.find('.countdown-number').text()).toBe('3')
    expect(wrapper.find('.countdown-text').text()).toBe('Get ready!')
  })

  it('should countdown from 3 to 0 and call startNextRound', async () => {
    const startNextRoundSpy = vi.fn()
    setupMockRounds()
    setupMockRace({ startNextRound: startNextRoundSpy })

    const wrapper = mountWithStubs()

    expect(wrapper.find('.countdown-number').text()).toBe('3')

    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.countdown-number').text()).toBe('2')

    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.countdown-number').text()).toBe('1')

    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.countdown-number').text()).toBe('0')
    expect(startNextRoundSpy).toHaveBeenCalledTimes(1)
  })

  it('should call startNextRound when skip button is clicked', async () => {
    const startNextRoundSpy = vi.fn()
    setupMockRounds()
    setupMockRace({ startNextRound: startNextRoundSpy })

    const wrapper = mountWithStubs()

    startNextRoundSpy.mockClear()

    const skipButton = wrapper.findComponent({ name: 'AppButton' })
    skipButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(startNextRoundSpy).toHaveBeenCalled()
  })

  it('should clear countdown interval when component is unmounted', () => {
    setupMockRounds()
    setupMockRace()

    const wrapper = mount(RoundTransitionModal)

    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

    wrapper.unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()

    clearIntervalSpy.mockRestore()
  })

  it('should clear countdown interval when nextRoundNumber becomes null', async () => {
    const nextRoundNumberRef = ref<number | null>(2)
    setupMockRounds()
    setupMockRace({
      nextRoundNumber: computed(() => nextRoundNumberRef.value) as unknown as ReturnType<
        typeof useRace
      >['nextRoundNumber'],
    })

    const wrapper = mount(RoundTransitionModal)

    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

    nextRoundNumberRef.value = null
    await wrapper.vm.$nextTick()

    expect(clearIntervalSpy).toHaveBeenCalled()

    clearIntervalSpy.mockRestore()
  })
})

