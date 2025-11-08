import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'

import { createMockUseProgram, createMockUseRace } from '@/composables/testing'
import { useProgram, useRace } from '@/composables'

import AppHeader from './AppHeader.vue'

vi.mock('@/composables', () => ({
  useProgram: vi.fn(),
  useRace: vi.fn(),
}))

describe('AppHeader', () => {
  const mockUseProgram = vi.mocked(useProgram)
  const mockUseRace = vi.mocked(useRace)

  const getButtons = (wrapper: ReturnType<typeof mount>) =>
    wrapper.findAllComponents({ name: 'AppButton' })

  const createRounds = () =>
    computed(() => [{ number: 1, distance: 1200, horses: [] }]) as ReturnType<typeof useProgram>['rounds']

  const clearRaceMocks = (mocks: ReturnType<typeof setupMocks>) => {
    mocks.race.startRace.mockClear()
    mocks.race.pauseRace.mockClear()
    mocks.race.resumeRace.mockClear()
  }

  const setupMocks = (overrides: {
    program?: Partial<{ generateProgram: ReturnType<typeof vi.fn>; rounds: ReturnType<typeof useProgram>['rounds'] }>
    race?: Partial<{
      raceStatus: ReturnType<typeof useRace>['raceStatus']
      startRace: ReturnType<typeof vi.fn>
      pauseRace: ReturnType<typeof vi.fn>
      resumeRace: ReturnType<typeof vi.fn>
    }>
  } = {}) => {
    const generateProgramSpy = overrides.program?.generateProgram || vi.fn()
    const rounds = overrides.program?.rounds || (computed(() => []) as ReturnType<typeof useProgram>['rounds'])

    const startRaceSpy = overrides.race?.startRace || vi.fn()
    const pauseRaceSpy = overrides.race?.pauseRace || vi.fn()
    const resumeRaceSpy = overrides.race?.resumeRace || vi.fn()
    const raceStatus =
      overrides.race?.raceStatus || (computed(() => 'idle' as const) as ReturnType<typeof useRace>['raceStatus'])

    mockUseProgram.mockReturnValue(
      createMockUseProgram({
        generateProgram: generateProgramSpy,
        rounds,
      })
    )
    mockUseRace.mockReturnValue(
      createMockUseRace({
        raceStatus,
        startRace: startRaceSpy,
        pauseRace: pauseRaceSpy,
        resumeRace: resumeRaceSpy,
      })
    )

    return {
      program: {
        generateProgram: generateProgramSpy,
        rounds,
      },
      race: {
        raceStatus,
        startRace: startRaceSpy,
        pauseRace: pauseRaceSpy,
        resumeRace: resumeRaceSpy,
      },
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    setupMocks()
  })

  it('should render title and both buttons', () => {
    const wrapper = mount(AppHeader)

    expect(wrapper.find('.header-title').text()).toBe('Horse Racing Game')

    const buttons = getButtons(wrapper)
    expect(buttons).toHaveLength(2)
    expect(buttons[0]?.text()).toBe('GENERATE PROGRAM')
  })

  it('should disable generate program button when race is running or paused', () => {
    const statuses: Array<'running' | 'paused'> = ['running', 'paused']

    statuses.forEach(status => {
      setupMocks({
        race: {
          raceStatus: computed(() => status) as ReturnType<typeof useRace>['raceStatus'],
        },
      })

      const wrapper = mount(AppHeader)
      const buttons = getButtons(wrapper)

      expect(buttons[0]?.props('disabled')).toBe(true)
    })
  })

  it('should enable generate program button when race is idle', () => {
    setupMocks({
      race: {
        raceStatus: computed(() => 'idle' as const) as ReturnType<typeof useRace>['raceStatus'],
      },
    })

    const wrapper = mount(AppHeader)
    const buttons = getButtons(wrapper)

    expect(buttons[0]?.props('disabled')).toBe(false)
  })

  it('should disable race control button when no rounds exist', () => {
    setupMocks({
      program: {
        rounds: computed(() => []) as ReturnType<typeof useProgram>['rounds'],
      },
    })

    const wrapper = mount(AppHeader)
    const buttons = getButtons(wrapper)

    expect(buttons[1]?.props('disabled')).toBe(true)
  })

  it('should enable race control button when rounds exist', () => {
    setupMocks({
      program: {
        rounds: createRounds(),
      },
    })

    const wrapper = mount(AppHeader)
    const buttons = getButtons(wrapper)

    expect(buttons[1]?.props('disabled')).toBe(false)
  })

  it('should display correct button text for each race status', () => {
    const testCases: Array<{
      status: 'idle' | 'finished' | 'running' | 'paused'
      expectedText: string
    }> = [
        { status: 'idle', expectedText: 'START RACE' },
        { status: 'finished', expectedText: 'START RACE' },
        { status: 'running', expectedText: 'PAUSE RACE' },
        { status: 'paused', expectedText: 'RESUME RACE' },
      ]

    testCases.forEach(({ status, expectedText }) => {
      setupMocks({
        race: {
          raceStatus: computed(() => status) as ReturnType<typeof useRace>['raceStatus'],
        },
      })

      const wrapper = mount(AppHeader)
      const buttons = getButtons(wrapper)

      expect(buttons[1]?.text()).toBe(expectedText)
    })
  })

  it('should call generateProgram when generate program button is clicked', () => {
    const mocks = setupMocks()
    const wrapper = mount(AppHeader)

    mocks.program.generateProgram.mockClear()

    const buttons = getButtons(wrapper)
    buttons[0]?.trigger('click')

    expect(mocks.program.generateProgram).toHaveBeenCalled()
  })

  it('should call correct race control function when button is clicked', () => {
    const testCases: Array<{
      status: 'idle' | 'finished' | 'running' | 'paused'
      expectedCall: 'startRace' | 'pauseRace' | 'resumeRace'
    }> = [
        { status: 'idle', expectedCall: 'startRace' },
        { status: 'finished', expectedCall: 'startRace' },
        { status: 'running', expectedCall: 'pauseRace' },
        { status: 'paused', expectedCall: 'resumeRace' },
      ]

    testCases.forEach(({ status, expectedCall }) => {
      const mocks = setupMocks({
        race: {
          raceStatus: computed(() => status) as ReturnType<typeof useRace>['raceStatus'],
        },
        program: {
          rounds: createRounds(),
        },
      })

      const wrapper = mount(AppHeader)
      clearRaceMocks(mocks)

      const buttons = getButtons(wrapper)
      buttons[1]?.trigger('click')

      expect(mocks.race[expectedCall]).toHaveBeenCalled()
      if (expectedCall === 'startRace') {
        expect(mocks.race.pauseRace).not.toHaveBeenCalled()
        expect(mocks.race.resumeRace).not.toHaveBeenCalled()
      } else if (expectedCall === 'pauseRace') {
        expect(mocks.race.startRace).not.toHaveBeenCalled()
        expect(mocks.race.resumeRace).not.toHaveBeenCalled()
      } else {
        expect(mocks.race.startRace).not.toHaveBeenCalled()
        expect(mocks.race.pauseRace).not.toHaveBeenCalled()
      }
    })
  })

  it('should set correct aria-label for buttons', () => {
    setupMocks({
      race: {
        raceStatus: computed(() => 'running' as const) as ReturnType<typeof useRace>['raceStatus'],
      },
    })

    const wrapper = mount(AppHeader)
    const buttons = getButtons(wrapper)

    expect(buttons[0]?.attributes('aria-label')).toBe('Generate race program')
    expect(buttons[1]?.attributes('aria-label')).toBe('PAUSE RACE')
  })

  it('should use default case in buttonText when race status is unknown', () => {
    setupMocks({
      race: {
        raceStatus: computed(() => 'unknown' as unknown as 'idle') as ReturnType<
          typeof useRace
        >['raceStatus'],
      },
    })

    const wrapper = mount(AppHeader)
    const buttons = getButtons(wrapper)

    expect(buttons[1]?.text()).toBe('START RACE')
  })
})

