import { describe, expect, it, vi } from 'vitest'

import { createMockHorse, createMockRoundResult } from '@/store/testing'

import { mutations } from './mutations'
import type { RaceState } from './types'

describe('Race Mutations', () => {
  const createState = (overrides?: Partial<RaceState>): RaceState => ({
    currentRound: 1,
    raceStatus: 'idle',
    horsePositions: {},
    allRoundResults: [],
    raceInterval: null,
    showRoundTransition: false,
    nextRoundNumber: null,
    ...overrides,
  })

  describe('SET_CURRENT_ROUND', () => {
    it('should set current round', () => {
      const state = createState()
      mutations.SET_CURRENT_ROUND(state, 3)
      expect(state.currentRound).toBe(3)
    })
  })

  describe('SET_RACE_STATUS', () => {
    it('should set race status', () => {
      const state = createState()
      mutations.SET_RACE_STATUS(state, 'running')
      expect(state.raceStatus).toBe('running')
    })
  })

  describe('SET_HORSE_POSITION', () => {
    it('should set horse position', () => {
      const state = createState()
      mutations.SET_HORSE_POSITION(state, { horseId: 'horse-1', position: 100 })
      expect(state.horsePositions['horse-1']).toBe(100)
    })
  })

  describe('ADD_ROUND_RESULT', () => {
    it('should add horse to round result', () => {
      const roundResult = createMockRoundResult({ number: 1, distance: 1200 })
      const state = createState({ allRoundResults: [roundResult] })

      const horse = createMockHorse({ id: 'horse-1' })

      mutations.ADD_ROUND_RESULT(state, { roundNumber: 1, position: 1, horse })

      expect(roundResult.horses).toHaveLength(1)
      expect(roundResult.horses[0]).toEqual({ position: 1, horse })
    })

    it('should not add if round result not found', () => {
      const state = createState()
      const horse = createMockHorse({ id: 'horse-1' })

      mutations.ADD_ROUND_RESULT(state, { roundNumber: 999, position: 1, horse })

      expect(state.allRoundResults).toHaveLength(0)
    })
  })

  describe('INITIALIZE_ROUND_RESULT', () => {
    it('should add round result to allRoundResults', () => {
      const state = createState()
      const roundResult = createMockRoundResult({ number: 1, distance: 1200 })

      mutations.INITIALIZE_ROUND_RESULT(state, roundResult)

      expect(state.allRoundResults).toHaveLength(1)
      expect(state.allRoundResults[0]).toEqual(roundResult)
    })
  })

  describe('RESET_RACE', () => {
    it('should reset all race state', () => {
      const state = createState({
        currentRound: 5,
        raceStatus: 'running',
        horsePositions: { 'horse-1': 100 },
        allRoundResults: [createMockRoundResult({ number: 1, distance: 1200 })],
        raceInterval: 123 as unknown as number,
        showRoundTransition: true,
        nextRoundNumber: 2,
      })

      mutations.RESET_RACE(state)

      expect(state.currentRound).toBe(1)
      expect(state.raceStatus).toBe('idle')
      expect(state.horsePositions).toEqual({})
      expect(state.allRoundResults).toEqual([])
      expect(state.raceInterval).toBeNull()
      expect(state.showRoundTransition).toBe(false)
      expect(state.nextRoundNumber).toBeNull()
    })
  })

  describe('RESET_ROUND', () => {
    it('should reset horse positions', () => {
      const state = createState({
        horsePositions: { 'horse-1': 100, 'horse-2': 200 },
      })

      mutations.RESET_ROUND(state)

      expect(state.horsePositions).toEqual({})
    })
  })

  describe('SET_RACE_INTERVAL', () => {
    it('should set race interval', () => {
      const state = createState()
      const interval = 123 as unknown as number
      mutations.SET_RACE_INTERVAL(state, interval)
      expect(state.raceInterval).toBe(interval)
    })

    it('should clear existing interval before setting new one', () => {
      const oldInterval = 123 as unknown as number
      const newInterval = 456 as unknown as number
      const state = createState({ raceInterval: oldInterval })

      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

      mutations.SET_RACE_INTERVAL(state, newInterval)

      expect(clearIntervalSpy).toHaveBeenCalledWith(oldInterval)
      expect(state.raceInterval).toBe(newInterval)

      clearIntervalSpy.mockRestore()
    })
  })

  describe('SHOW_ROUND_TRANSITION', () => {
    it('should show round transition modal', () => {
      const state = createState()
      mutations.SHOW_ROUND_TRANSITION(state, 2)
      expect(state.showRoundTransition).toBe(true)
      expect(state.nextRoundNumber).toBe(2)
    })
  })

  describe('HIDE_ROUND_TRANSITION', () => {
    it('should hide round transition modal', () => {
      const state = createState({
        showRoundTransition: true,
        nextRoundNumber: 2,
      })

      mutations.HIDE_ROUND_TRANSITION(state)

      expect(state.showRoundTransition).toBe(false)
      expect(state.nextRoundNumber).toBeNull()
    })
  })
})
