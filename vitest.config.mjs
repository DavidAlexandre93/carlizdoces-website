import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.{js,jsx,mjs}'],
    exclude: ['tests/**/*.test.cjs'],
  },
});
