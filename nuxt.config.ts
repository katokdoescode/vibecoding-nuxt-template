// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/scripts',
    '@nuxtjs/supabase',
    'nuxt-mcp',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Base Vibe Coding Template',
      meta: [
        { name: 'description', content: 'Base Vibe Coding Template' },
        { name: 'keywords', content: 'template, coding, nuxt, tailwind, shadcn, supabase, mcp, ai' },
      ],
    },
  },
  css: ['~/assets/css/tailwind.css'],
  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    public: {
      stripePriceId: process.env.STRIPE_PRICE_ID,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  },
  compatibilityDate: '2025-05-15',
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ['debug'],
    },
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
    css: {
      devSourcemap: true,
    },
    build: {
      sourcemap: process.env.NODE_ENV === 'development',
    },
  },
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: true,
      },
    },
  },
  icon: {
    serverBundle: {
      collections: ['lucide'],
    },
  },
  shadcn: {
    prefix: 'U',
  },
  supabase: {
    redirect: false,
  },
});
