<template>
  <div>
    <div style="width:100%; max-width:500px; padding: 0 10px;">
      <skip-widget></skip-widget>
    </div>
  </div>
</template>

<script setup>
  const skipWidget = document.querySelector("skip-widget");

  if (skipWidget) {
    skipWidget.onRouteUpdated = (route) => {
      console.log("route updated", route);
    };
  }
</script>