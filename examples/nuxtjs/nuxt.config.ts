// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  plugins: [
    { src: './plugins/skip-widget.client.ts', mode: 'client' },
  ],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['skip-widget'].includes(tag),
    },
  },
})
