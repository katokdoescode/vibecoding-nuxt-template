// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    '@stylistic/no-tabs': 'off',
    '@stylistic/no-mixed-spaces-and-tabs': 'off',
    '@ts-expect-error': 'off',
  },
  ignores: [
    '.nuxt',
    'node_modules',
    'dist',
    'public',
    'package.json',
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    'bun.lockb',
    'bun.lock',
    'bun.lockb',
  ],
});
