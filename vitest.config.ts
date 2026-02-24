import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    server: {
      deps: {
        inline: [
          '@thesysai/genui-sdk',
          '@crayonai/react-ui',
          '@crayonai/react-core',
        ],
      },
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
      {
        find: /.+\.(css|less|scss|sass)(\?.*)?$/,
        replacement: resolve(__dirname, './test/__mocks__/styleMock.ts'),
      },
    ],
  },
})
