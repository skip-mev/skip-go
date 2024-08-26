// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  plugins: [
    { src: './plugins/skip-widget.client.ts', mode: 'client' },
  ],
  vite: {
    optimizeDeps: {
      noDiscovery: true,
      exclude: ['@skip-go/widget'],
    },
  }
})
