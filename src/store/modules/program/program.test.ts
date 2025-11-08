import { beforeEach, describe, expect, it } from 'vitest'
import { createStore } from 'vuex'

import type { RootState } from '../../types'
import { createMockHorse, createMockRound } from '@/store/testing'

import programModule, { getUniqueRandomItem } from './program'
import type { ProgramState } from './program'

describe('Program Module', () => {
  let store: ReturnType<typeof createStore<RootState>>

  beforeEach(() => {
    store = createStore<RootState>({
      modules: {
        program: programModule,
      },
    })
  })

  describe('Mutations', () => {
    it('SET_HORSES should set horses', () => {
      const horses = [createMockHorse({ id: 'horse-1' })]

      store.commit('program/SET_HORSES', horses)

      const state = store.state.program as ProgramState
      expect(state.horses).toEqual(horses)
    })

    it('SET_ROUNDS should set rounds', () => {
      const rounds = [createMockRound({ number: 1, distance: 1200, horses: [] })]

      store.commit('program/SET_ROUNDS', rounds)

      const state = store.state.program as ProgramState
      expect(state.rounds).toEqual(rounds)
    })
  })

  describe('Actions', () => {
    it('generateProgram should generate horses when horses are empty', async () => {
      // This should trigger the if branch at line 94-97
      await store.dispatch('program/generateProgram')

      const state = store.state.program as ProgramState
      expect(state.horses.length).toBeGreaterThan(0)
      expect(state.rounds.length).toBeGreaterThan(0)
    })

    it('generateHorses should generate and set horses', async () => {
      const horses = await store.dispatch('program/generateHorses')

      expect(horses).toBeDefined()
      expect(horses.length).toBeGreaterThan(0)

      const state = store.state.program as ProgramState
      expect(state.horses).toEqual(horses)
    })

    it('generateProgram should not regenerate horses if they exist', async () => {
      // Generate horses first
      await store.dispatch('program/generateHorses')
      const initialHorses = (store.state.program as ProgramState).horses

      // Generate program (should reuse existing horses - else branch)
      await store.dispatch('program/generateProgram')

      const state = store.state.program as ProgramState
      expect(state.horses).toEqual(initialHorses)
      expect(state.rounds.length).toBeGreaterThan(0)
    })
  })

  describe('Getters', () => {
    it('horses should return horses', () => {
      const horses = [createMockHorse({ id: 'horse-1' })]

      store.commit('program/SET_HORSES', horses)

      const result = store.getters['program/horses']
      expect(result).toEqual(horses)
    })

    it('rounds should return rounds', () => {
      const rounds = [createMockRound({ number: 1, distance: 1200, horses: [] })]

      store.commit('program/SET_ROUNDS', rounds)

      const result = store.getters['program/rounds']
      expect(result).toEqual(rounds)
    })
  })

  describe('getUniqueRandomItem', () => {
    it('should return null when all items are used (line 15 branch)', () => {
      const array = ['item1', 'item2', 'item3']
      const used = new Set(['item1', 'item2', 'item3'])

      const result = getUniqueRandomItem(array, used)

      expect(result).toBeNull()
    })
  })
})

