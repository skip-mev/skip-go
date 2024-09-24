import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
  import('https://unpkg.com/@skip-go/widget-web-component/build/index.js') as any
})