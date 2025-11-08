import { vi } from 'vitest'

// Global Vuex mock
vi.mock('vuex', async importOriginal => {
  const actual = await importOriginal<typeof import('vuex')>()
  return {
    ...actual,
    useStore: vi.fn(),
  }
})
