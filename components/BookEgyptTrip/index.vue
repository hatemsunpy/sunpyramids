<template>
  <div class="bg-[#f9fafb]">
    <BookEgyptTripHero :img="PageData?.banner" :imgPhone="PageData?.phone_banner" />

    <BookEgyptTripWhy />

    <LazyBookEgyptTripSelectedTours />

    <LazyBookEgyptTripContactUs />

    <div class="w-full py-20 xl:px-20" id="home-reviews"></div>

    <LazyHomeGallary />
  </div>
</template>

<script setup lang='js'>
const { getData } = useApi()
const { addSeo } = useSeo()
const PageData = ref([])
PageData.value = await getData('pages/book-egypt-trip?includes=seo').then((res) => {
  return res.data
})

addSeo(PageData.value)
</script>

<style scoped lang='scss'></style>