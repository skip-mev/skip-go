// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from 'vite-plugin-node-polyfills'
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  vite: {
    optimizeDeps: {
      noDiscovery: true,
      include: [],
      exclude: ['cssesc']
    },
    plugins: [
      nodePolyfills()
    ]
  },
})
