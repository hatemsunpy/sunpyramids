<template>
  <div class="lg:col-span-2 col-span-3">
    <ToursLeftPanalMainSwiper :tour="tour" />

    <ToursLeftPanalInfo :tour="tour" />

    <ToursLeftPanalHighlights :tour="tour" :price="props.price" />

    <ToursLeftPanalItinerary v-if="tour" :tour="tour" />

    <ToursLeftPanalInclude :tour="tour" />

    <ToursLeftPanalExclude :tour="tour" />

    <ToursLeftPanalAdds v-if="props.tour?.options.length" :tour="tour" v-model:adds="addsValues" :addsValues="props.addsValues" />
  </div>
</template>

<script setup lang="js">
const props = defineProps({
  tour: {
    type: Object
  },
  addsValues: {
    type: Array,
    default: () => []
  },
  price: {
    type: Object
  }
})

const tour = ref(null)
watch(() => props.tour, (newVal) => {
  if (newVal) tour.value = newVal
}, {
  deep: true,
  immediate: true
})

const addsValues = ref([])
const emits = defineEmits(['update:adds'])
watch(addsValues, () => {
  emits('update:adds', addsValues.value)
})
</script>

<style scoped lang="scss"></style>
