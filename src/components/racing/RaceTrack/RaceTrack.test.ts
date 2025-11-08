import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'

import { createMockUseProgram, createMockUseRace } from '@/composables/testing'
import { useProgram, useRace } from '@/composables'
import { createMockHorse, createMockRound } from '@/store/testing'

import RaceTrack from './RaceTrack.vue'

vi.mock('@/composables', () => ({
  useProgram: vi.fn(),
  useRace: vi.fn(),
}))

describe('RaceTrack', () => {
  const mockUseProgram = vi.mocked(useProgram)
  const mockUseRace = vi.mocked(useRace)

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProgram.mockReturnValue(createMockUseProgram())
    mockUseRace.mockReturnValue(createMockUseRace())
  })

  it('should render empty state when no rounds', () => {
    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        rounds: computed(() => []) as unknown as ReturnType<typeof useProgram>['rounds'],
      })
    )

    const wrapper = mount(RaceTrack)

    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-state-content h2').text()).toBe('No Race Program')
    expect(wrapper.find('.empty-state-content p').text()).toBe('Please generate a program to start the race.')
  })

  it('should render title, track, lanes, and horses when rounds exist', () => {
    const mockHorses = [
      createMockHorse({ id: 'horse-1', color: '#FF0000' }),
      createMockHorse({ id: 'horse-2', color: '#00FF00' }),
    ]

    const mockRounds = [
      createMockRound({
        number: 1,
        distance: 1200,
        horses: mockHorses,
      }),
    ]

    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        rounds: computed(() => mockRounds) as unknown as ReturnType<typeof useProgram>['rounds'],
      })
    )
    mockUseRace.mockReturnValue(
      createMockUseRace({
        currentRound: computed(() => 1) as unknown as ReturnType<typeof useRace>['currentRound'],
        horsePositions: computed(() => ({})) as unknown as ReturnType<typeof useRace>['horsePositions'],
      })
    )

    const wrapper = mount(RaceTrack)

    expect(wrapper.find('h2').text()).toBe('1st Lap 1200m')

    const track = wrapper.find('.track')
    expect(track.exists()).toBe(true)
    expect(track.attributes('style')).toContain('width:')

    const lanes = wrapper.findAll('.lane')
    expect(lanes).toHaveLength(2)
    expect(lanes[0]?.find('.lane-number').text()).toBe('1')
    expect(lanes[1]?.find('.lane-number').text()).toBe('2')

    const horseIcons = wrapper.findAllComponents({ name: 'HorseIcon' })
    expect(horseIcons).toHaveLength(2)
    expect(horseIcons[0]?.props('color')).toBe('#FF0000')
    expect(horseIcons[0]?.props('size')).toBe(60)
    expect(horseIcons[1]?.props('color')).toBe('#00FF00')

    expect(wrapper.find('.finish-line').exists()).toBe(true)
    expect(wrapper.find('.finish-line').text()).toBe('FINISH')
  })

  it('should position horses based on horsePositions', () => {
    const mockHorses = [createMockHorse({ id: 'horse-1', color: '#FF0000' })]

    const mockRounds = [
      createMockRound({
        number: 1,
        distance: 1200,
        horses: mockHorses,
      }),
    ]

    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        rounds: computed(() => mockRounds) as unknown as ReturnType<typeof useProgram>['rounds'],
      })
    )
    mockUseRace.mockReturnValue(
      createMockUseRace({
        currentRound: computed(() => 1) as unknown as ReturnType<typeof useRace>['currentRound'],
        horsePositions: computed(() => ({ 'horse-1': 100 })) as unknown as ReturnType<
          typeof useRace
        >['horsePositions'],
      })
    )

    const wrapper = mount(RaceTrack)

    const horseContainer = wrapper.find('.horse-container')
    expect(horseContainer.attributes('style')).toContain('left: 148px')
  })

  it('should use default position 0 when horse position is not set', () => {
    const mockHorses = [createMockHorse({ id: 'horse-1', color: '#FF0000' })]

    const mockRounds = [
      createMockRound({
        number: 1,
        distance: 1200,
        horses: mockHorses,
      }),
    ]

    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        rounds: computed(() => mockRounds) as unknown as ReturnType<typeof useProgram>['rounds'],
      })
    )
    mockUseRace.mockReturnValue(
      createMockUseRace({
        currentRound: computed(() => 1) as unknown as ReturnType<typeof useRace>['currentRound'],
        horsePositions: computed(() => ({})) as unknown as ReturnType<typeof useRace>['horsePositions'],
      })
    )

    const wrapper = mount(RaceTrack)

    const horseContainer = wrapper.find('.horse-container')
    expect(horseContainer.attributes('style')).toContain('left: 48px')
  })

  it('should use default distance 1200 when currentRoundData is not found', () => {
    const mockRounds = [createMockRound({ number: 2, distance: 1500 })]

    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        rounds: computed(() => mockRounds) as unknown as ReturnType<typeof useProgram>['rounds'],
      })
    )
    mockUseRace.mockReturnValue(
      createMockUseRace({
        currentRound: computed(() => 1) as unknown as ReturnType<typeof useRace>['currentRound'],
      })
    )

    const wrapper = mount(RaceTrack)

    expect(wrapper.find('h2').text()).toBe('1st Lap 1200m')
  })

  it('should use default track length 600 when distance is not in RACE_CONFIG', () => {
    const mockRounds = [createMockRound({ number: 1, distance: 9999 })]

    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        rounds: computed(() => mockRounds) as unknown as ReturnType<typeof useProgram>['rounds'],
      })
    )
    mockUseRace.mockReturnValue(
      createMockUseRace({
        currentRound: computed(() => 1) as unknown as ReturnType<typeof useRace>['currentRound'],
      })
    )

    const wrapper = mount(RaceTrack)

    const track = wrapper.find('.track')
    expect(track.attributes('style')).toContain('width: 648px')
  })
})
