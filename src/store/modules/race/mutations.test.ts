import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mutations } from './mutations'
import type { RaceState } from './types'
import { createMockHorse, createMockRoundResult } from '@/store/testing'

describe('Race Mutations', () => {
  let state: RaceState

  beforeEach(() => {
    state = {
      currentRound: 1,
      raceStatus: 'idle',
      horsePositions: {},
      allRoundResults: [],
      raceInterval: null,
    }
  })

  describe('SET_CURRENT_ROUND', () => {
    it('should set current round', () => {
      mutations.SET_CURRENT_ROUND(state, 3)
      expect(state.currentRound).toBe(3)
    })
  })

  describe('SET_RACE_STATUS', () => {
    it('should set race status', () => {
      mutations.SET_RACE_STATUS(state, 'running')
      expect(state.raceStatus).toBe('running')
    })
  })

  describe('SET_HORSE_POSITION', () => {
    it('should set horse position', () => {
      mutations.SET_HORSE_POSITION(state, { horseId: 'horse-1', position: 100 })
      expect(state.horsePositions['horse-1']).toBe(100)
    })
  })

  describe('ADD_ROUND_RESULT', () => {
    it('should add horse to round result', () => {
      const roundResult = createMockRoundResult({ number: 1, distance: 1200 })
      state.allRoundResults.push(roundResult)

      const horse = createMockHorse({ id: 'horse-1' })

      mutations.ADD_ROUND_RESULT(state, { roundNumber: 1, position: 1, horse })

      expect(roundResult.horses).toHaveLength(1)
      expect(roundResult.horses[0]).toEqual({ position: 1, horse })
    })

    it('should not add if round result not found', () => {
      const horse = createMockHorse({ id: 'horse-1' })

      mutations.ADD_ROUND_RESULT(state, { roundNumber: 999, position: 1, horse })

      expect(state.allRoundResults).toHaveLength(0)
    })
  })

  describe('INITIALIZE_ROUND_RESULT', () => {
    it('should add round result to allRoundResults', () => {
      const roundResult = createMockRoundResult({ number: 1, distance: 1200 })

      mutations.INITIALIZE_ROUND_RESULT(state, roundResult)

      expect(state.allRoundResults).toHaveLength(1)
      expect(state.allRoundResults[0]).toEqual(roundResult)
    })
  })

  describe('RESET_RACE', () => {
    it('should reset all race state', () => {
      state.currentRound = 5
      state.raceStatus = 'running'
      state.horsePositions = { 'horse-1': 100 }
      state.allRoundResults = [createMockRoundResult({ number: 1, distance: 1200 })]
      state.raceInterval = 123 as unknown as number

      mutations.RESET_RACE(state)

      expect(state.currentRound).toBe(1)
      expect(state.raceStatus).toBe('idle')
      expect(state.horsePositions).toEqual({})
      expect(state.allRoundResults).toEqual([])
      expect(state.raceInterval).toBeNull()
    })
  })

  describe('RESET_ROUND', () => {
    it('should reset horse positions', () => {
      state.horsePositions = { 'horse-1': 100, 'horse-2': 200 }

      mutations.RESET_ROUND(state)

      expect(state.horsePositions).toEqual({})
    })
  })

  describe('SET_RACE_INTERVAL', () => {
    it('should set race interval', () => {
      const interval = 123 as unknown as number
      mutations.SET_RACE_INTERVAL(state, interval)
      expect(state.raceInterval).toBe(interval)
    })

    it('should clear existing interval before setting new one', () => {
      const oldInterval = 123 as unknown as number
      const newInterval = 456 as unknown as number
      state.raceInterval = oldInterval

      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

      mutations.SET_RACE_INTERVAL(state, newInterval)

      expect(clearIntervalSpy).toHaveBeenCalledWith(oldInterval)
      expect(state.raceInterval).toBe(newInterval)

      clearIntervalSpy.mockRestore()
    })
  })
})
