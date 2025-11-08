import { describe, expect, it, vi } from 'vitest'

import { createMockHorse, createMockRound, createMockRoundResult } from '@/store/testing'

import { calculateSpeed, getCurrentRoundResult, getTrackLength, initializeRound } from './helpers'
import type { RaceState } from './types'

describe('Race Helpers', () => {
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

  describe('calculateSpeed', () => {
    it('should return higher speed for higher condition', () => {
      const highConditionHorse = createMockHorse({ condition: 100 })
      const lowConditionHorse = createMockHorse({ condition: 10 })

      // Mock Math.random to get same base speed
      const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.5)

      const highSpeed = calculateSpeed(highConditionHorse)
      const lowSpeed = calculateSpeed(lowConditionHorse)

      expect(highSpeed).toBeGreaterThan(lowSpeed)

      mockRandom.mockRestore()
    })
  })

  describe('getTrackLength', () => {
    it('should return correct track length for known distances', () => {
      expect(getTrackLength(1200)).toBe(600)
      expect(getTrackLength(1600)).toBe(800)
      expect(getTrackLength(2000)).toBe(1000)
    })

    it('should return default track length for unknown distances', () => {
      expect(getTrackLength(9999)).toBe(600)
    })
  })

  describe('getCurrentRoundResult', () => {
    it('should return current round result', () => {
      const roundResult = createMockRoundResult({ number: 1, distance: 1200 })
      const state = createState({
        currentRound: 1,
        allRoundResults: [roundResult],
      })

      const result = getCurrentRoundResult(state)

      expect(result).toEqual(roundResult)
    })

    it('should return undefined if round result not found', () => {
      const state = createState({
        currentRound: 2,
        allRoundResults: [createMockRoundResult({ number: 1, distance: 1200 })],
      })

      const result = getCurrentRoundResult(state)

      expect(result).toBeUndefined()
    })
  })

  describe('initializeRound', () => {
    it('should initialize horse positions for new horses', () => {
      const horse1 = createMockHorse({ id: 'horse-1' })
      const horse2 = createMockHorse({ id: 'horse-2' })

      const roundData = createMockRound({
        number: 1,
        distance: 1200,
        horses: [horse1, horse2],
      })

      const state = createState()
      const commit = vi.fn()

      initializeRound(1, roundData, commit, state)

      expect(commit).toHaveBeenCalledWith('SET_HORSE_POSITION', { horseId: 'horse-1', position: 0 })
      expect(commit).toHaveBeenCalledWith('SET_HORSE_POSITION', { horseId: 'horse-2', position: 0 })
      expect(commit).toHaveBeenCalledWith('INITIALIZE_ROUND_RESULT', {
        number: 1,
        distance: 1200,
        horses: [],
      })
      expect(commit).toHaveBeenCalledTimes(3) // 2 horses + 1 round result
    })

    it('should not initialize position for existing horses', () => {
      const horse1 = createMockHorse({ id: 'horse-1' })
      const horse2 = createMockHorse({ id: 'horse-2' })

      const roundData = createMockRound({
        number: 1,
        distance: 1200,
        horses: [horse1, horse2],
      })

      const state = createState({
        horsePositions: {
          'horse-1': 100, // Already exists
        },
      })
      const commit = vi.fn()

      initializeRound(1, roundData, commit, state)

      // Should only set position for horse-2 (new horse)
      expect(commit).toHaveBeenCalledWith('SET_HORSE_POSITION', { horseId: 'horse-2', position: 0 })
      expect(commit).not.toHaveBeenCalledWith('SET_HORSE_POSITION', { horseId: 'horse-1', position: 0 })
      expect(commit).toHaveBeenCalledWith('INITIALIZE_ROUND_RESULT', {
        number: 1,
        distance: 1200,
        horses: [],
      })
      expect(commit).toHaveBeenCalledTimes(2) // 1 new horse + 1 round result
    })
  })
})
