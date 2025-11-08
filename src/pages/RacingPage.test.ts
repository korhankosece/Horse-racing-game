import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { useStore } from 'vuex'

import { createMockUseProgram, createMockUseRace } from '@/composables/testing'
import { useProgram, useRace } from '@/composables'
import { createTestStore } from '@/store/testing'

import RacingPage from './RacingPage.vue'

vi.mock('@/composables', () => ({
  useProgram: vi.fn(),
  useRace: vi.fn(),
}))

describe('RacingPage', () => {
  let store: ReturnType<typeof createTestStore>
  const mockUseProgram = vi.mocked(useProgram)
  const mockUseRace = vi.mocked(useRace)

  beforeEach(() => {
    vi.clearAllMocks()
    store = createTestStore()
    vi.mocked(useStore).mockReturnValue(store)
  })

  it('should render all child components', () => {
    mockUseProgram.mockReturnValue(createMockUseProgram())
    mockUseRace.mockReturnValue(createMockUseRace())

    const wrapper = mount(RacingPage)

    expect(wrapper.find('.racing-page').exists()).toBe(true)
    expect(wrapper.find('.top-section').exists()).toBe(true)
    expect(wrapper.find('.bottom-section').exists()).toBe(true)
  })

  it('should call generateHorses when horses are empty on mount', () => {
    const generateHorsesSpy = vi.fn()
    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        generateHorses: generateHorsesSpy,
        horses: ref([]) as unknown as ReturnType<typeof useProgram>['horses'],
      })
    )
    mockUseRace.mockReturnValue(createMockUseRace())

    mount(RacingPage)

    expect(generateHorsesSpy).toHaveBeenCalledTimes(1)
  })

  it('should not call generateHorses when horses already exist', () => {
    const generateHorsesSpy = vi.fn()
    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        generateHorses: generateHorsesSpy,
        horses: ref([{ id: 'horse-1', name: 'Test', condition: 100, color: '#FF0000' }]) as unknown as ReturnType<
          typeof useProgram
        >['horses'],
      })
    )
    mockUseRace.mockReturnValue(createMockUseRace())

    mount(RacingPage)

    expect(generateHorsesSpy).not.toHaveBeenCalled()
  })

  it('should render RoundTransitionModal when showRoundTransition is true', () => {
    mockUseProgram.mockReturnValue(createMockUseProgram())
    mockUseRace.mockReturnValue(
      createMockUseRace({
        showRoundTransition: ref(true) as unknown as ReturnType<typeof useRace>['showRoundTransition'],
        nextRoundNumber: ref(2) as unknown as ReturnType<typeof useRace>['nextRoundNumber'],
      })
    )

    const wrapper = mount(RacingPage)

    expect(wrapper.findComponent({ name: 'RoundTransitionModal' }).exists()).toBe(true)
  })
})

