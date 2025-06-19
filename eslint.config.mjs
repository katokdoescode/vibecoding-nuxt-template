// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    '@stylistic/no-tabs': 'off',
    '@ts-expect-error': 'off',
  },
});
