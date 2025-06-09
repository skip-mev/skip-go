import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
  /**
   * NOTE on bundle size in dev:
   *
   * When you import the widget from npm during development:
   * 
   * - The widget includes its dependencies (React, ReactDOM, etc), which results in ~200 KB+ of JavaScript.
   * - This causes noticeably slower dev performance.
   *
   * Production builds will tree-shake and optimize this import correctly,
   * but during dev, the full bundle is pulled in unoptimized.
   */
  import('@skip-go/widget-web-component');
  /**
   * Alternative: Use the cdn link for much faster dev startup:
   * 
   *   import('https://unpkg.com/@skip-go/widget-web-component/build/index.js') as any
   * 
   * - This skips bundling entirely — the widget is loaded as an external es module.
   * - The cdn version is prebuilt and only ~2 KB, since it excludes heavy peer dependencies.
   */
})