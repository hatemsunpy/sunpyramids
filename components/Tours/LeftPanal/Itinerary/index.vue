<template>
  <div class="my-12">
    <ToursSharedHeader :isClosedAll="isClosedAll" @expandAll="time = Date.now(), isClosedAll = !isClosedAll"
      :title="$t('labels.tours.itinerary')">
      <div class="mt-4">
        <ToursLeftPanalItineraryDay :time="time" v-for="(item, index) in tour?.days"
          :showAfterElement="index != tour?.days.length - 1" :day="item" :index="index" :isClosedAll="isClosedAll" />
      </div>
    </ToursSharedHeader>
  </div>
</template>

<script setup lang='js'>
const props = defineProps({
  tour: {
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

const time = ref(Date.now())
const isClosedAll = ref(true)
</script>

<style scoped lang='scss'></style>