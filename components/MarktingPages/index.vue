<template>
  <div class="bg-[#f9fafb]">
    <MarktingPagesHero :img="PageData?.banner" :imgPhone="PageData?.phone_banner" :title="PageData?.title" :description="PageData?.description" />

    <MarktingPagesWhy :cards="PageData?.cards" :title="PageData?.sub_title_1" />

    <LazyMarktingPagesSelectedTours :tours="PageData?.category?.tours" :title="PageData?.sub_title_2" />

    <LazyMarktingPagesContactUs />

    <div class="w-full py-20 xl:px-20" id="home-reviews" style="min-height: 100px"></div>

    <LazyHomeGallary />
  </div>
</template>

<script setup lang='js'>
const { getData } = useApi()
const { addSeo } = useSeo()
const PageData = ref([])
const route = useRoute()
PageData.value = await getData('custom-pages/'+route.params.slug).then((res) => {
  return res.data
})

addSeo(PageData.value)

</script>

<style scoped lang='scss'></style>