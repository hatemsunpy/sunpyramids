<template>
  <div class="md:py-10  2xl:px-20 xl:px-8 md:px-4 px-0   bg-white grid grid-cols-3 xl:gap-9 gap-4">
    <h1 v-if="tour?.title" class="text-[2.125rem] md:block hidden font-medium w-full col-span-3 md:pt-20">
      {{ tour?.title }}
    </h1>

    <ToursLeftPanal :tour="props.tour" v-model:adds="addsValues" :addsValues="addsValues" :price="price" />

    <ToursRightPanal :tour="props.tour" v-model:adds="addsValues" :addsValues="addsValues" v-model:price="price" />

  </div>
  <ToursLeftPanalAffordable v-if="props.tour?.seasons.length" :tour="props.tour" />

  <ToursLeftPanalGallary v-if="props.tour" :socials="props.tour?.social_links" />

  <!-- <ToursLeftPanalReviews /> -->

  <ToursLeftPanalRelated v-if="related_tours" :tours="related_tours" />

  <HomeMakeYourTrip />

</template>

<script setup lang="js">
const props = defineProps({
  tour: {
    type: Object
  }
})

const price = ref({
  price: 0,
  withDicount: 0
})

const addsValues = ref([])
const emits = defineEmits(['update:adds'])
watch(addsValues, () => {
  emits('update:adds', addsValues.value)
})
const { getData } = useApi()

const related_tours = ref([])
const isrelated_tours = ref(false)

const getTours = async () => {
  related_tours.value = []
  let params = [`includes=categories`, `&order_by=display_order,asc`, `&exists=wishlisted`, `&id!=${tour.value.id}`]

  if (tour.value.categories.length) {
    tour.value.categories.forEach(element => {
      params = [...params, `&categories.id%5B%5D=${element.id}`]
    });
  }

  const query = params.join("")
  await getData(`tours?${query}`).then((res) => {
    related_tours.value = res.data.data
    isrelated_tours.value = true
  })
}

const tour = computed(() => {
  return props.tour || {}
})

watch(tour, (newVal) => {
  if (newVal) {
    getTours()
  }
}, {
  deep: true,
  immediate: true
})


</script>

<style scoped lang="scss"></style>
