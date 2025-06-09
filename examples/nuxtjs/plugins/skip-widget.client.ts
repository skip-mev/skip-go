import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
  import('@skip-go/widget-web-component')
  // or replace with link below to use cdn link
  // import('https://unpkg.com/@skip-go/widget-web-component/build/index.js') as any
})