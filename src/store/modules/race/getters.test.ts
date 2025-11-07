import { describe, it, expect } from 'vitest'
import { getters } from './getters'
import type { RaceState } from './types'
import { createMockHorse, createMockRoundResult } from '@/store/testing'

describe('Race Getters', () => {
  const createState = (overrides?: Partial<RaceState>): RaceState => ({
    currentRound: 1,
    raceStatus: 'idle',
    horsePositions: {},
    allRoundResults: [],
    raceInterval: null,
    ...overrides,
  })

  describe('currentRound', () => {
    it('should return current round', () => {
      const state = createState({ currentRound: 3 })
      expect(getters.currentRound(state)).toBe(3)
    })
  })

  describe('raceStatus', () => {
    it('should return race status', () => {
      const state = createState({ raceStatus: 'running' })
      expect(getters.raceStatus(state)).toBe('running')
    })
  })

  describe('horsePositions', () => {
    it('should return horse positions', () => {
      const positions = { 'horse-1': 100, 'horse-2': 200 }
      const state = createState({ horsePositions: positions })
      expect(getters.horsePositions(state)).toEqual(positions)
    })
  })

  describe('currentRoundResults', () => {
    it('should return horses for current round', () => {
      const horse = createMockHorse({ id: 'horse-1' })
      const roundResult = createMockRoundResult({
        number: 1,
        distance: 1200,
        horses: [{ position: 1, horse }],
      })

      const state = createState({
        currentRound: 1,
        allRoundResults: [roundResult],
      })

      expect(getters.currentRoundResults(state)).toEqual([{ position: 1, horse }])
    })

    it('should return empty array if round result not found', () => {
      const state = createState({ currentRound: 2 })
      expect(getters.currentRoundResults(state)).toEqual([])
    })
  })

  describe('allRoundResults', () => {
    it('should return all round results', () => {
      const roundResults = [
        createMockRoundResult({ number: 1, distance: 1200 }),
        createMockRoundResult({ number: 2, distance: 1600 }),
      ]

      const state = createState({ allRoundResults: roundResults })
      expect(getters.allRoundResults(state)).toEqual(roundResults)
    })
  })
})
