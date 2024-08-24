<script setup lang="ts">
import { initializeSwapWidget } from '@skip-go/widget/web-component';

initializeSwapWidget();
</script>
<template>
  <div>
    <div style="width: 450px; height: 820px">
      <client-only>
        <skip-widget />
      </client-only>
    </div>
  </div>
</template>
