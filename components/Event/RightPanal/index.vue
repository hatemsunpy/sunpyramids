<template>
  <div class="2xl:col-span-2 lg:col-span-3  col-span-8">
    <EventRightPanalDetails :data="props.data" />

    <EventRightPanalBook :title="props.data?.title" />

  </div>
</template>

<script setup lang='js'>
const props = defineProps({
  data: {
    type: Object,
    default: () => { }
  }
})
</script>

<style scoped lang='scss'></style>