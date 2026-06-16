<template>
  <div class="bg-[#f9fafb]">
    <DisabledHero :img="PageData?.banner" :imgPhone="PageData?.phone_banner" :title="PageData?.title"
      :description="PageData?.short_description" />

    <DisabledOverview />

    <DisabledContactUs />

    <EventRelatedTours v-if="relatedTours.length" :tours="relatedTours" />

    <EventRelatedBlogs />
    

    <div class="py-20">
      <div class=" lg:px-20 px-4 mb-4">
        <h3 class="text-[2.125rem] font-bold">
          {{ $t("labels.ClientsFeedback") }}
        </h3>
      </div>


      <div class="w-full xl:px-20 bg-w" id="home-reviews"></div>
    </div>
  </div>
</template>

<script setup lang='js'>
const { getData } = useApi()
const { addSeo } = useSeo()
const PageData = ref([])
PageData.value = await getData('pages/special-page?includes=seo').then((res) => {
  return res.data
})

addSeo(PageData.value)
const relatedTours = ref([])
relatedTours.value = await getData(`tours?exists=wishlisted&categories.id=66&order_by=display_order,asc&page=1&page_limit=10`).then((res) => {
  return res.data.data
})
</script>

<style scoped lang='scss'></style>