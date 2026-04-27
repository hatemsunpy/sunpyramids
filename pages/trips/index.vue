<template>
  <Trips />

  <div class="bg-[#ffffff]">
    <HomeNeedHelp />
  </div>
</template>

<script setup lang="js">
const { getData } = useApi()
const { addSeo } = useSeo()

const trips = ref(null)
trips.value = await getData("pages/tours-search-results?includes=seo").then((res) => {
  return res.data
})
addSeo(trips.value)
</script>

<style scoped lang="scss"></style>
