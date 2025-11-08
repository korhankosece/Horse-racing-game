import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'

import { createMockUseRace } from '@/composables/testing'
import { useRace } from '@/composables'
import { createMockHorse, createMockRoundResult } from '@/store/testing'

import Results from './Results.vue'

vi.mock('@/composables', () => ({
  useRace: vi.fn(),
}))

describe('Results', () => {
  const mockUseRace = vi.mocked(useRace)

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseRace.mockReturnValue(createMockUseRace())
  })

  it('should render title', () => {
    const wrapper = mount(Results)

    expect(wrapper.find('h2').text()).toBe('Results')
  })

  it('should render empty state when no results', () => {
    mockUseRace.mockReturnValue(
      createMockUseRace({
        allRoundResults: computed(() => []) as unknown as ReturnType<typeof useRace>['allRoundResults'],
      })
    )

    const wrapper = mount(Results)

    expect(wrapper.find('.results-content').exists()).toBe(true)
    expect(wrapper.findAll('.round-section')).toHaveLength(0)
  })

  it('should render results with correct titles and tables', () => {
    const mockResults = [
      createMockRoundResult({ number: 1, distance: 1200 }),
      createMockRoundResult({ number: 2, distance: 1500 }),
    ]

    mockUseRace.mockReturnValue(
      createMockUseRace({
        allRoundResults: computed(() => mockResults) as unknown as ReturnType<typeof useRace>['allRoundResults'],
      })
    )

    const wrapper = mount(Results)

    const roundTitles = wrapper.findAll('.round-title')
    expect(roundTitles).toHaveLength(2)
    expect(roundTitles[0]?.text()).toBe('1st Lap - 1200m')
    expect(roundTitles[1]?.text()).toBe('2nd Lap - 1500m')

    const tables = wrapper.findAllComponents({ name: 'AppTable' })
    expect(tables).toHaveLength(2)
    expect(tables[0]?.props('columns')).toEqual([
      { key: 'position', label: 'Position' },
      { key: 'name', label: 'Name' },
    ])
  })

  it('should render horses with correct positions in table data', () => {
    const mockHorses = [
      createMockHorse({ id: 'horse-1', name: 'Thunder' }),
      createMockHorse({ id: 'horse-2', name: 'Lightning' }),
      createMockHorse({ id: 'horse-3', name: 'Storm' }),
    ]

    const mockResults = [
      createMockRoundResult({
        number: 1,
        distance: 1200,
        horses: [
          { position: 1, horse: mockHorses[0]! },
          { position: 2, horse: mockHorses[1]! },
          { position: 3, horse: mockHorses[2]! },
        ],
      }),
    ]

    mockUseRace.mockReturnValue(
      createMockUseRace({
        allRoundResults: computed(() => mockResults) as unknown as ReturnType<typeof useRace>['allRoundResults'],
      })
    )

    const wrapper = mount(Results)

    const table = wrapper.findComponent({ name: 'AppTable' })
    expect(table.props('data')).toEqual([
      { position: 1, name: 'Thunder' },
      { position: 2, name: 'Lightning' },
      { position: 3, name: 'Storm' },
    ])
  })

  it('should handle empty horses array in result', () => {
    const mockResults = [
      createMockRoundResult({
        number: 1,
        distance: 1200,
        horses: [],
      }),
    ]

    mockUseRace.mockReturnValue(
      createMockUseRace({
        allRoundResults: computed(() => mockResults) as unknown as ReturnType<typeof useRace>['allRoundResults'],
      })
    )

    const wrapper = mount(Results)

    const table = wrapper.findComponent({ name: 'AppTable' })
    expect(table.props('data')).toEqual([])
  })
})

