import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createMockHorse, createMockRound, createMockRoundResult, createTestStore } from '@/store/testing'

describe('Race Actions', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('startRace', () => {
    it('should return if no rounds available', async () => {
      store = createTestStore()
      await store.dispatch('race/startRace')
      expect(store.state.race.raceStatus).toBe('idle')
    })

    it('should start race when rounds are available', async () => {
      const mockRound = createMockRound({ number: 1, distance: 1200 })
      store = createTestStore({
        programState: { horses: [], rounds: [mockRound] },
      })

      await store.dispatch('race/startRace')

      expect(store.state.race.raceStatus).toBe('running')
      expect(store.state.race.currentRound).toBe(1)
      expect(store.state.race.raceInterval).not.toBeNull()
      vi.advanceTimersByTime(100)
    })

    it('should reset race if starting from idle or finished state', async () => {
      const mockRound = createMockRound({ number: 1, distance: 1200 })
      store = createTestStore({
        programState: { horses: [], rounds: [mockRound] },
        raceState: {
          raceStatus: 'finished',
          currentRound: 1,
          allRoundResults: [{ number: 1, distance: 1200, horses: [] }],
        },
      })

      await store.dispatch('race/startRace')

      expect(store.state.race.raceStatus).toBe('running')
      expect(store.state.race.allRoundResults).toHaveLength(1)
    })

    it('should not start race if already running', async () => {
      const mockRound = createMockRound({ number: 1, distance: 1200 })
      store = createTestStore({
        programState: { horses: [], rounds: [mockRound] },
        raceState: { raceStatus: 'running' },
      })

      await store.dispatch('race/startRace')
      expect(store.state.race.raceStatus).toBe('running')
    })
  })

  describe('pauseRace', () => {
    it('should pause race when running and clear interval', async () => {
      const mockInterval = setInterval(() => { }, 100) as unknown as number
      store = createTestStore({
        raceState: {
          raceStatus: 'running',
          currentRound: 1,
          raceInterval: mockInterval,
        },
      })

      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
      await store.dispatch('race/pauseRace')

      expect(store.state.race.raceStatus).toBe('paused')
      expect(store.state.race.raceInterval).toBeNull()
      expect(clearIntervalSpy).toHaveBeenCalledWith(mockInterval)
      clearIntervalSpy.mockRestore()
    })

    it('should not pause race if not running', async () => {
      store = createTestStore({ raceState: { raceStatus: 'idle' } })
      await store.dispatch('race/pauseRace')
      expect(store.state.race.raceStatus).toBe('idle')
    })
  })

  describe('resumeRace', () => {
    it('should resume race when paused and create new interval', async () => {
      const mockRound = createMockRound({ number: 1, distance: 1200 })
      store = createTestStore({
        programState: { horses: [], rounds: [mockRound] },
        raceState: {
          raceStatus: 'paused',
          currentRound: 1,
          allRoundResults: [{ number: 1, distance: 1200, horses: [] }],
        },
      })

      await store.dispatch('race/resumeRace')

      expect(store.state.race.raceStatus).toBe('running')
      expect(store.state.race.raceInterval).not.toBeNull()
      vi.advanceTimersByTime(100)
    })

    it('should not resume race if not paused', async () => {
      store = createTestStore({ raceState: { raceStatus: 'idle' } })
      await store.dispatch('race/resumeRace')
      expect(store.state.race.raceStatus).toBe('idle')
    })
  })

  describe('stopRace', () => {
    it('should reset race state', async () => {
      const mockInterval = setInterval(() => { }, 100) as unknown as number
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
          raceInterval: mockInterval,
        },
      })

      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

      await store.dispatch('race/stopRace')

      expect(store.state.race.currentRound).toBe(1)
      expect(store.state.race.raceStatus).toBe('idle')
      expect(store.state.race.horsePositions).toEqual({})
      expect(store.state.race.allRoundResults).toEqual([])
      expect(store.state.race.raceInterval).toBeNull()
      expect(clearIntervalSpy).toHaveBeenCalledWith(mockInterval)

      clearIntervalSpy.mockRestore()
    })
  })

  describe('tickRace', () => {
    it('should return early if race status is not running', async () => {
      store = createTestStore({
        raceState: { raceStatus: 'paused', currentRound: 1 },
      })
      await store.dispatch('race/tickRace')
      expect(store.state.race.raceStatus).toBe('paused')
    })

    it('should set status to finished if currentRoundData is not found', async () => {
      const mockRound = createMockRound({ number: 2, distance: 1200 })
      store = createTestStore({
        programState: { horses: [], rounds: [mockRound] },
        raceState: { raceStatus: 'running', currentRound: 1, allRoundResults: [] },
      })
      await store.dispatch('race/tickRace')
      expect(store.state.race.raceStatus).toBe('finished')
    })

    it('should return early if currentRoundResult is not found', async () => {
      const mockRound = createMockRound({ number: 1, distance: 1200 })
      store = createTestStore({
        programState: { horses: [], rounds: [mockRound] },
        raceState: { raceStatus: 'running', currentRound: 1, allRoundResults: [] },
      })
      await store.dispatch('race/tickRace')
      expect(store.state.race.raceStatus).toBe('running')
    })

    it('should update horse positions', async () => {
      const horse1 = createMockHorse({ id: 'horse-1', condition: 100 })
      const horse2 = createMockHorse({ id: 'horse-2', condition: 50 })
      const mockRound = createMockRound({
        number: 1,
        distance: 1200,
        horses: [horse1, horse2],
      })
      const mockRoundResult = createMockRoundResult({
        number: 1,
        distance: 1200,
        horses: [],
      })

      store = createTestStore({
        programState: { horses: [horse1, horse2], rounds: [mockRound] },
        raceState: {
          raceStatus: 'running',
          currentRound: 1,
          horsePositions: {},
          allRoundResults: [mockRoundResult],
        },
      })

      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      await store.dispatch('race/tickRace')

      expect(store.state.race.horsePositions['horse-1']).toBeGreaterThan(0)
      expect(store.state.race.horsePositions['horse-2']).toBeGreaterThan(0)
      vi.spyOn(Math, 'random').mockRestore()
    })

    it('should skip horses that already finished', async () => {
      const horse1 = createMockHorse({ id: 'horse-1', condition: 100 })
      const horse2 = createMockHorse({ id: 'horse-2', condition: 50 })
      const mockRound = createMockRound({
        number: 1,
        distance: 1200,
        horses: [horse1, horse2],
      })
      const mockRoundResult = createMockRoundResult({
        number: 1,
        distance: 1200,
        horses: [{ position: 1, horse: horse1 }],
      })

      store = createTestStore({
        programState: { horses: [horse1, horse2], rounds: [mockRound] },
        raceState: {
          raceStatus: 'running',
          currentRound: 1,
          horsePositions: { 'horse-1': 600, 'horse-2': 0 },
          allRoundResults: [mockRoundResult],
        },
      })

      const initialHorse1Position = store.state.race.horsePositions['horse-1']
      await store.dispatch('race/tickRace')

      expect(store.state.race.horsePositions['horse-1']).toBe(initialHorse1Position)
      expect(store.state.race.horsePositions['horse-2']).toBeGreaterThan(0)
    })

    it('should add horse to round result when finished', async () => {
      const horse1 = createMockHorse({ id: 'horse-1', condition: 100 })
      const mockRound = createMockRound({
        number: 1,
        distance: 1200,
        horses: [horse1],
      })
      const mockRoundResult = createMockRoundResult({
        number: 1,
        distance: 1200,
        horses: [],
      })

      store = createTestStore({
        programState: { horses: [horse1], rounds: [mockRound] },
        raceState: {
          raceStatus: 'running',
          currentRound: 1,
          horsePositions: { 'horse-1': 599 },
          allRoundResults: [mockRoundResult],
        },
      })

      vi.spyOn(Math, 'random').mockReturnValue(1)
      await store.dispatch('race/tickRace')

      expect(mockRoundResult.horses.length).toBeGreaterThan(0)
      expect(mockRoundResult.horses[0]?.horse.id).toBe('horse-1')
      vi.spyOn(Math, 'random').mockRestore()
    })

    it('should show transition modal when all horses finished', async () => {
      const horse1 = createMockHorse({ id: 'horse-1', condition: 100 })
      const horse2 = createMockHorse({ id: 'horse-2', condition: 50 })
      const mockRound1 = createMockRound({
        number: 1,
        distance: 1200,
        horses: [horse1, horse2],
      })
      const mockRound2 = createMockRound({
        number: 2,
        distance: 1400,
        horses: [horse1, horse2],
      })
      const mockRoundResult = createMockRoundResult({
        number: 1,
        distance: 1200,
        horses: [
          { position: 1, horse: horse1 },
          { position: 2, horse: horse2 },
        ],
      })

      store = createTestStore({
        programState: { horses: [horse1, horse2], rounds: [mockRound1, mockRound2] },
        raceState: {
          raceStatus: 'running',
          currentRound: 1,
          horsePositions: { 'horse-1': 600, 'horse-2': 600 },
          allRoundResults: [mockRoundResult],
        },
      })

      await store.dispatch('race/tickRace')

      // Should pause race and show transition modal
      expect(store.state.race.raceStatus).toBe('paused')
      expect(store.state.race.showRoundTransition).toBe(true)
      expect(store.state.race.nextRoundNumber).toBe(2)
      expect(store.state.race.currentRound).toBe(1) // Not moved yet
    })

    it('should clear interval when showing transition modal', async () => {
      const horse1 = createMockHorse({ id: 'horse-1', condition: 100 })
      const horse2 = createMockHorse({ id: 'horse-2', condition: 50 })
      const mockRound1 = createMockRound({
        number: 1,
        distance: 1200,
        horses: [horse1, horse2],
      })
      const mockRound2 = createMockRound({
        number: 2,
        distance: 1400,
        horses: [horse1, horse2],
      })
      const mockRoundResult = createMockRoundResult({
        number: 1,
        distance: 1200,
        horses: [
          { position: 1, horse: horse1 },
          { position: 2, horse: horse2 },
        ],
      })

      const mockInterval = setInterval(() => { }, 100) as unknown as number
      store = createTestStore({
        programState: { horses: [horse1, horse2], rounds: [mockRound1, mockRound2] },
        raceState: {
          raceStatus: 'running',
          currentRound: 1,
          horsePositions: { 'horse-1': 600, 'horse-2': 600 },
          allRoundResults: [mockRoundResult],
          raceInterval: mockInterval,
        },
      })

      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
      await store.dispatch('race/tickRace')

      // Should clear interval when showing transition modal
      expect(clearIntervalSpy).toHaveBeenCalledWith(mockInterval)
      expect(store.state.race.raceInterval).toBeNull()
      expect(store.state.race.showRoundTransition).toBe(true)
      clearIntervalSpy.mockRestore()
    })

    it('should return early if nextRoundNumber is null', async () => {
      store = createTestStore({
        raceState: {
          raceStatus: 'paused',
          currentRound: 1,
          showRoundTransition: true,
          nextRoundNumber: null,
        },
      })

      const initialRound = store.state.race.currentRound
      await store.dispatch('race/startNextRound')

      // Should not change anything
      expect(store.state.race.currentRound).toBe(initialRound)
      expect(store.state.race.raceStatus).toBe('paused')
    })

    it('should move to next round when startNextRound is called', async () => {
      const horse1 = createMockHorse({ id: 'horse-1', condition: 100 })
      const horse2 = createMockHorse({ id: 'horse-2', condition: 50 })
      const mockRound1 = createMockRound({
        number: 1,
        distance: 1200,
        horses: [horse1, horse2],
      })
      const mockRound2 = createMockRound({
        number: 2,
        distance: 1400,
        horses: [horse1, horse2],
      })

      store = createTestStore({
        programState: { horses: [horse1, horse2], rounds: [mockRound1, mockRound2] },
        raceState: {
          raceStatus: 'paused',
          currentRound: 1,
          showRoundTransition: true,
          nextRoundNumber: 2,
          allRoundResults: [
            {
              number: 1,
              distance: 1200,
              horses: [
                { position: 1, horse: horse1 },
                { position: 2, horse: horse2 },
              ],
            },
          ],
        },
      })

      await store.dispatch('race/startNextRound')

      expect(store.state.race.currentRound).toBe(2)
      expect(store.state.race.raceStatus).toBe('running')
      expect(store.state.race.showRoundTransition).toBe(false)
      expect(store.state.race.nextRoundNumber).toBeNull()
      expect(store.state.race.horsePositions['horse-1']).toBe(0)
      expect(store.state.race.horsePositions['horse-2']).toBe(0)
      expect(store.state.race.allRoundResults).toHaveLength(2)
      expect(store.state.race.raceInterval).not.toBeNull()
      vi.advanceTimersByTime(100)
    })

    it('should finish race when all rounds completed', async () => {
      const horse1 = createMockHorse({ id: 'horse-1', condition: 100 })
      const mockRound = createMockRound({
        number: 1,
        distance: 1200,
        horses: [horse1],
      })
      const mockRoundResult = createMockRoundResult({
        number: 1,
        distance: 1200,
        horses: [{ position: 1, horse: horse1 }],
      })

      const mockInterval = setInterval(() => { }, 100) as unknown as number
      store = createTestStore({
        programState: { horses: [horse1], rounds: [mockRound] },
        raceState: {
          raceStatus: 'running',
          currentRound: 1,
          horsePositions: { 'horse-1': 600 },
          allRoundResults: [mockRoundResult],
          raceInterval: mockInterval,
        },
      })

      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
      await store.dispatch('race/tickRace')

      expect(store.state.race.raceStatus).toBe('finished')
      expect(store.state.race.raceInterval).toBeNull()
      expect(clearIntervalSpy).toHaveBeenCalledWith(mockInterval)
      clearIntervalSpy.mockRestore()
    })
  })
})

