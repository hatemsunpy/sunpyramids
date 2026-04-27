<template>
  <slot />
</template>

<script setup lang="js">
import { sharedStore } from '~/stores/sharedStore.js'
const { getCurrancies } = sharedStore()
await getCurrancies()
</script>