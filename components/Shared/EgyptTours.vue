<template>
  <section v-if="destinations.length"
    class="grid 2xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 sm:gap-6 gap-4 py-8 xl:py-16 px-4 xl:px-20">
    <SharedEgyptToursCard :type="props.type" v-for="item in destinations" :data="item" :key="item" :path="props.path" />
  </section>

  <UILoadingData v-else />
</template>

<script setup lang='js'>
const { getData } = useApi()
const props = defineProps({
  url: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  path: {
    type: String,
    default: ''
  }
})
const destinations = ref([])

const getdestinations = async () => {
  await getData(props.url).then((res) => {
    destinations.value = res.data.data
  })
}
getdestinations()
</script>

<style scoped lang='scss'></style>