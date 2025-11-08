import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'

import { createMockUseProgram } from '@/composables/testing'
import { useProgram } from '@/composables'
import { createMockHorse, createMockRound } from '@/store/testing'

import Program from './Program.vue'

vi.mock('@/composables', () => ({
  useProgram: vi.fn(),
}))

describe('Program', () => {
  const mockUseProgram = vi.mocked(useProgram)

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProgram.mockReturnValue(createMockUseProgram())
  })

  it('should render title', () => {
    const wrapper = mount(Program)

    expect(wrapper.find('h2').text()).toBe('Program')
  })

  it('should render empty state when no rounds', () => {
    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        rounds: computed(() => []) as unknown as ReturnType<typeof useProgram>['rounds'],
      })
    )

    const wrapper = mount(Program)

    expect(wrapper.find('.program-content').exists()).toBe(true)
    expect(wrapper.findAll('.round-section')).toHaveLength(0)
  })

  it('should render rounds with correct titles and tables', () => {
    const mockRounds = [
      createMockRound({ number: 1, distance: 1200 }),
      createMockRound({ number: 2, distance: 1500 }),
    ]

    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        rounds: computed(() => mockRounds) as unknown as ReturnType<typeof useProgram>['rounds'],
      })
    )

    const wrapper = mount(Program)

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

    const wrapper = mount(Program)

    const table = wrapper.findComponent({ name: 'AppTable' })
    expect(table.props('data')).toEqual([
      { position: 1, name: 'Thunder' },
      { position: 2, name: 'Lightning' },
      { position: 3, name: 'Storm' },
    ])
  })

  it('should handle empty horses array in round', () => {
    const mockRounds = [
      createMockRound({
        number: 1,
        distance: 1200,
        horses: [],
      }),
    ]

    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        rounds: computed(() => mockRounds) as unknown as ReturnType<typeof useProgram>['rounds'],
      })
    )

    const wrapper = mount(Program)

    const table = wrapper.findComponent({ name: 'AppTable' })
    expect(table.props('data')).toEqual([])
  })
})
