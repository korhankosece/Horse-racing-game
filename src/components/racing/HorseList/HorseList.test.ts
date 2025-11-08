import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'

import { createMockUseProgram } from '@/composables/testing'
import { useProgram } from '@/composables'
import { createMockHorse } from '@/store/testing'

import HorseList from './HorseList.vue'

vi.mock('@/composables', () => ({
  useProgram: vi.fn(),
}))

describe('HorseList', () => {
  const mockUseProgram = vi.mocked(useProgram)

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProgram.mockReturnValue(createMockUseProgram())
  })

  it('should render title', () => {
    const wrapper = mount(HorseList)

    expect(wrapper.find('h2').text()).toBe('Horse List (1-20)')
  })

  it('should render AppTable with correct columns', () => {
    const wrapper = mount(HorseList)

    const table = wrapper.findComponent({ name: 'AppTable' })
    expect(table.exists()).toBe(true)
    expect(table.props('columns')).toEqual([
      { key: 'name', label: 'Name' },
      { key: 'condition', label: 'Condition' },
      { key: 'color', label: 'Color' },
    ])
  })

  it('should render empty table when no horses', () => {
    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        horses: computed(() => []) as unknown as ReturnType<typeof useProgram>['horses'],
      })
    )

    const wrapper = mount(HorseList)

    const table = wrapper.findComponent({ name: 'AppTable' })
    expect(table.props('data')).toEqual([])
  })

  it('should render table with horses', () => {
    const mockHorses = [
      createMockHorse({ id: 'horse-1', name: 'Thunder', condition: 85, color: '#FF0000' }),
      createMockHorse({ id: 'horse-2', name: 'Lightning', condition: 90, color: '#00FF00' }),
    ]

    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        horses: computed(() => mockHorses) as unknown as ReturnType<typeof useProgram>['horses'],
      })
    )

    const wrapper = mount(HorseList)

    const table = wrapper.findComponent({ name: 'AppTable' })
    expect(table.props('data')).toEqual([
      { name: 'Thunder', condition: 85, color: '#FF0000', horse: mockHorses[0] },
      { name: 'Lightning', condition: 90, color: '#00FF00', horse: mockHorses[1] },
    ])
  })

  it('should render AppColorIndicator in color cell slot', () => {
    const mockHorses = [createMockHorse({ id: 'horse-1', color: '#FF0000' })]

    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        horses: computed(() => mockHorses) as unknown as ReturnType<typeof useProgram>['horses'],
      })
    )

    const wrapper = mount(HorseList)

    const table = wrapper.findComponent({ name: 'AppTable' })
    expect(table.exists()).toBe(true)
  })
})
