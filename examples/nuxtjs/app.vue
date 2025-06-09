<template>
  <div>
    <div style="width:100%; max-width:500px; padding: 0 10px;">
      <skip-widget></skip-widget>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(async () => {
  await customElements.whenDefined('skip-widget');

  const skipWidget = document?.querySelector("skip-widget");

  if (skipWidget) {
    skipWidget.brandColor = "lightgreen";
    skipWidget.onRouteUpdated = (route) => {
      console.log("route updated", route);
    };
    // You can set other properties or callbacks here
    // skipWidget.prop = value;
  }
});
</script>