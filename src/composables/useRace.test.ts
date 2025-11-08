import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStore } from 'vuex'

import { createMockRoundResult, createTestStore } from '@/store/testing'

import { useRace } from './useRace'

describe('useRace', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return all race getters and actions', () => {
    const store = createTestStore({
      raceState: {
        currentRound: 2,
        raceStatus: 'running',
        horsePositions: { 'horse-1': 100 },
        allRoundResults: [createMockRoundResult({ number: 1, distance: 1200 })],
        showRoundTransition: true,
        nextRoundNumber: 3,
      },
    })

    vi.mocked(useStore).mockReturnValue(store)

    const {
      currentRound,
      raceStatus,
      horsePositions,
      allRoundResults,
      showRoundTransition,
      nextRoundNumber,
      startRace,
      pauseRace,
      resumeRace,
      stopRace,
      startNextRound,
    } = useRace()

    expect(currentRound.value).toBe(2)
    expect(raceStatus.value).toBe('running')
    expect(horsePositions.value).toEqual({ 'horse-1': 100 })
    expect(allRoundResults.value).toHaveLength(1)
    expect(showRoundTransition.value).toBe(true)
    expect(nextRoundNumber.value).toBe(3)
    expect(typeof startRace).toBe('function')
    expect(typeof pauseRace).toBe('function')
    expect(typeof resumeRace).toBe('function')
    expect(typeof stopRace).toBe('function')
    expect(typeof startNextRound).toBe('function')
  })

  it('should return computed values that react to store changes', () => {
    const store = createTestStore()

    vi.mocked(useStore).mockReturnValue(store)

    const { currentRound, raceStatus } = useRace()

    expect(currentRound.value).toBe(1)
    expect(raceStatus.value).toBe('idle')

    store.commit('race/SET_CURRENT_ROUND', 5)
    store.commit('race/SET_RACE_STATUS', 'running')

    expect(currentRound.value).toBe(5)
    expect(raceStatus.value).toBe('running')
  })

  it('should call all action functions', () => {
    const store = createTestStore()

    vi.mocked(useStore).mockReturnValue(store)

    const dispatchSpy = vi.spyOn(store, 'dispatch')

    const { startRace, pauseRace, resumeRace, stopRace, startNextRound } = useRace()

    startRace()
    pauseRace()
    resumeRace()
    stopRace()
    startNextRound()

    expect(dispatchSpy).toHaveBeenCalledWith('race/startRace')
    expect(dispatchSpy).toHaveBeenCalledWith('race/pauseRace')
    expect(dispatchSpy).toHaveBeenCalledWith('race/resumeRace')
    expect(dispatchSpy).toHaveBeenCalledWith('race/stopRace')
    expect(dispatchSpy).toHaveBeenCalledWith('race/startNextRound')
    expect(dispatchSpy).toHaveBeenCalledTimes(5)

    dispatchSpy.mockRestore()
  })
})
