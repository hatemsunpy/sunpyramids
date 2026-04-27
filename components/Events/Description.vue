<template>
  <section class="pt-8 px-4 xl:px-20">
    <div class="lg:text-lg text-base font-medium text-textDark lg:text-start text-start " v-html="props.description"></div>
  </section>
</template>

<script setup lang='js'>
const props = defineProps({
  description: {
    type: String,
    required: true
  }
})
</script>

<style scoped lang='scss'></style>