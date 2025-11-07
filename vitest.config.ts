import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/**/*.test.ts',
          'src/**/*.spec.ts',
          'src/**/*.d.ts',
          'src/main.ts',
          'src/vite-env.d.ts',
          'src/vuex.d.ts',
          'src/**/index.ts', // Barrel export files
          'src/**/types.ts', // Type definition files
          'src/**/state.ts', // State definition files (no executable logic)
        ],
      },
    },
  }),
)
