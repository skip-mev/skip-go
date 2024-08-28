import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {

  const loadSkipWidget = async () => {
    return import('@skip-go/widget/web-component');
  };

  loadSkipWidget();

  return {
    provide: {
      loadSkipWidget
    }
  }
});