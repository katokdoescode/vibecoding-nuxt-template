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
	],
	devtools: { enabled: true },
	css: ['~/assets/css/tailwind.css'],
	runtimeConfig: {
		openaiApiKey: process.env.OPENAI_API_KEY,
	},
	compatibilityDate: '2025-05-15',
	vite: {
		plugins: [
			tailwindcss(),
		],
	},
	eslint: {
		config: {
			stylistic: {
				indent: 'tab',
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
