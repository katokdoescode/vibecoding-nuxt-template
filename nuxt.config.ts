// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/scripts',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    'nuxt-mcp',
    'shadcn-nuxt',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
  },
  compatibilityDate: '2025-05-15',
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: true,
      },
    },
  },
  shadcn: {
    prefix: 'U',
  },
  supabase: {
    redirect: false,
  },
});
