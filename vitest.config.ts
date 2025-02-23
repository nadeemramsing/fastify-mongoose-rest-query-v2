import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    globalSetup: './test/setup/globalSetup.ts',
    setupFiles: ['./test/setup/setup.ts'],
  },
  plugins: [tsconfigPaths()],
})
