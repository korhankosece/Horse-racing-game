import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createTestStore, createMockRound } from '@/store/testing'

describe('Race Actions', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    vi.useFakeTimers()
    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => { })
    vi.spyOn(console, 'warn').mockImplementation(() => { })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('startRace', () => {
    it('should warn and return if no rounds available', async () => {
      store = createTestStore()

      await store.dispatch('race/startRace')

      expect(console.warn).toHaveBeenCalledWith(
        'No rounds available. Please generate program first.'
      )
      expect(store.state.race.raceStatus).toBe('idle')
    })

    it('should start race when rounds are available', async () => {
      const mockRound = createMockRound({ number: 1, distance: 1200 })
      store = createTestStore({
        programState: {
          horses: [],
          rounds: [mockRound],
        },
      })

      await store.dispatch('race/startRace')

      expect(store.state.race.raceStatus).toBe('running')
      expect(store.state.race.currentRound).toBe(1)
      expect(console.log).toHaveBeenCalled()
    })

    it('should not start race if already running', async () => {
      const mockRound = createMockRound({ number: 1, distance: 1200 })
      store = createTestStore({
        programState: {
          horses: [],
          rounds: [mockRound],
        },
        raceState: {
          raceStatus: 'running',
        },
      })

      await store.dispatch('race/startRace')

      // Should not change status
      expect(store.state.race.raceStatus).toBe('running')
    })
  })

  describe('pauseRace', () => {
    it('should pause race when running', async () => {
      store = createTestStore({
        raceState: {
          raceStatus: 'running',
          currentRound: 1,
        },
      })

      await store.dispatch('race/pauseRace')

      expect(store.state.race.raceStatus).toBe('paused')
      expect(console.log).toHaveBeenCalled()
    })

    it('should not pause race if not running', async () => {
      store = createTestStore({
        raceState: {
          raceStatus: 'idle',
        },
      })

      await store.dispatch('race/pauseRace')

      expect(store.state.race.raceStatus).toBe('idle')
    })
  })

  describe('resumeRace', () => {
    it('should resume race when paused', async () => {
      store = createTestStore({
        raceState: {
          raceStatus: 'paused',
          currentRound: 1,
        },
      })

      await store.dispatch('race/resumeRace')

      expect(store.state.race.raceStatus).toBe('running')
      expect(console.log).toHaveBeenCalled()
    })

    it('should not resume race if not paused', async () => {
      store = createTestStore({
        raceState: {
          raceStatus: 'idle',
        },
      })

      await store.dispatch('race/resumeRace')

      expect(store.state.race.raceStatus).toBe('idle')
    })
  })

  describe('stopRace', () => {
    it('should reset race state', async () => {
      store = createTestStore({
        raceState: {
          currentRound: 5,
          raceStatus: 'running',
          horsePositions: { 'horse-1': 100 },
          allRoundResults: [
            {
              number: 1,
              distance: 1200,
              horses: [],
            },
          ],
          raceInterval: 123 as unknown as number,
        },
      })

      await store.dispatch('race/stopRace')

      expect(store.state.race.currentRound).toBe(1)
      expect(store.state.race.raceStatus).toBe('idle')
      expect(store.state.race.horsePositions).toEqual({})
      expect(store.state.race.allRoundResults).toEqual([])
      expect(store.state.race.raceInterval).toBeNull()
    })
  })
})

