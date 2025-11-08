import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStore } from 'vuex'

import { createMockHorse, createMockRound, createTestStore } from '@/store/testing'

import { useProgram } from './useProgram'

describe('useProgram', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return all program getters and actions', () => {
    const mockHorse = createMockHorse({ id: 'horse-1' })
    const mockRound = createMockRound({ number: 1, distance: 1200 })

    const store = createTestStore({
      programState: {
        horses: [mockHorse],
        rounds: [mockRound],
      },
    })

    vi.mocked(useStore).mockReturnValue(store)

    const { horses, rounds, generateHorses, generateProgram } = useProgram()

    expect(horses.value).toEqual([mockHorse])
    expect(rounds.value).toEqual([mockRound])
    expect(typeof generateHorses).toBe('function')
    expect(typeof generateProgram).toBe('function')
  })

  it('should return computed values that react to store changes', () => {
    const store = createTestStore()

    vi.mocked(useStore).mockReturnValue(store)

    const { horses, rounds } = useProgram()

    expect(horses.value).toEqual([])
    expect(rounds.value).toEqual([])

    const mockHorse = createMockHorse({ id: 'horse-1' })
    store.commit('program/SET_HORSES', [mockHorse])

    expect(horses.value).toEqual([mockHorse])
  })

  it('should call generateHorses action', () => {
    const store = createTestStore()

    vi.mocked(useStore).mockReturnValue(store)

    const dispatchSpy = vi.spyOn(store, 'dispatch')

    const { generateHorses } = useProgram()

    generateHorses()

    expect(dispatchSpy).toHaveBeenCalledWith('program/generateHorses')
    expect(dispatchSpy).toHaveBeenCalledTimes(1)

    dispatchSpy.mockRestore()
  })

  it('should call generateProgram and stopRace actions', () => {
    const store = createTestStore()

    vi.mocked(useStore).mockReturnValue(store)

    const dispatchSpy = vi.spyOn(store, 'dispatch')

    const { generateProgram } = useProgram()

    generateProgram()

    expect(dispatchSpy).toHaveBeenCalledWith('program/generateProgram')
    expect(dispatchSpy).toHaveBeenCalledWith('race/stopRace')
    expect(dispatchSpy).toHaveBeenCalledTimes(2)

    dispatchSpy.mockRestore()
  })
})
