<template>
  <div class="my-12">
    <ToursSharedHeader :isClosedAll="isClosedAll" @expandAll="time = Date.now(), isClosedAll = !isClosedAll"
      :title="$t('labels.tours.highlights')">
      <template v-if="tour && !tour.highlights">
        <div class="h-52 relative rounded-[1.25rem] overflow-hidden w-full">
          <UIMap :PolygonCoords="getPolygonCoords()" :zoom="5" />

          <div
            class="absolute px-4 py-3 hover:bg-black/50 bg-transparent transition-all z-10 top-0 left-0  w-full h-full">

            <button @click="isShowModel = true"
              class="flex  justify-center rounded-full hover:bg-[#c57007] items-center gap-2 ml-auto text-white bg-secondary px-[10px] py-3">
              <NuxtImg src="/images/eye-white.png" class="text-xl w-5 h-5" />

              <span class="font-medium"> {{ $t('labels.tours.viewDistination') }}
              </span>
            </button>
          </div>
        </div>

        <ToursLeftPanalHighlightsMapModel :tour="tour" @close="isShowModel = false" :data="cities" :price="props.price"
          :polygonCoords="getPolygonCoords()" v-if="isShowModel" />

        <div class="mt-4">
          <template v-for="attraction in attractions" :key="attraction.id">
            <ToursLeftPanalHighlightsAttractions v-if="attraction.children && attraction.children.length" :time="time"
              :isClosedAll="isClosedAll" :attraction="attraction" />
          </template>
        </div>
      </template>

      <template v-if="tour && tour.highlights">
        <div v-html="tour.highlights">
        </div>
      </template>
    </ToursSharedHeader>
  </div>
</template>

<script setup lang='js'>
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
const isClosedAll = ref(true)
const tour = ref(null)
const attractions = ref([])
const cities = ref([])
watch(() => props.tour, (newVal) => {
  if (newVal) {
    tour.value = newVal
    attractions.value = getFeaturedDestinationsWithChildren(newVal.destinations)
    cities.value = newVal.destinations.filter((city) => (!city.global && city.enabled && !city.featured) || (!city.global && city.enabled && city.featured))
  }
}, {
  deep: true,
  immediate: true
})
const isShowModel = ref(false)

const time = ref(Date.now())

const getPolygonCoords = () => {
  return cities.value.filter((city) => (!city.global && city.enabled && !city.featured)).map(coord => ({
    lat: +coord.latitude,
    lng: +coord.longitude
  }));
};

function getFeaturedDestinationsWithChildren(destinations) {
  return destinations
    .filter(dest => dest.global === false && dest.enabled && dest.featured)
    .map(parent => {
      const children = destinations.filter(child => child.parent_id === parent.id);
      return {
        ...parent,
        children
      };
    });
}
</script>

<style scoped lang='scss'></style>