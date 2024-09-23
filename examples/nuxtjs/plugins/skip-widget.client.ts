import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  import('https://unpkg.com/@skip-go/widget-web-component/build/index.js') as any
})