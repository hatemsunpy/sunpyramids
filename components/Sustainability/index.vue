<template>
  <section class="w-full h-[16.6875rem] flex relative items-end ">
    <div class="w-full h-full absolute top-0 categoryBox start-0" >
      <!-- <NuxtImg class="w-full h-full  object-cover object-center z-0" v-if="privacyData && privacyData.banner"
        :src="privacyData.banner" /> -->

      <NuxtImg class="w-full h-full  object-cover object-center z-0"  src="/images/faqs-banner.png" />

      <div class="absolute bottom-0 start-0 w-full h-[70%] categoryBox"></div>
    </div>

    <h1 class="lg:text-[3rem] text-3xl text-white z-10 lg:px-20 px-4 pb-11 font-bold textShadow">
      <!-- {{ $t("labels.privacy.banner") }} -->
      Sustainability
    </h1>
  </section>

  <section class="2xl:px-20 px-4 py-14 bg-white">
    <SustainabilityOverview />
  </section>

  <section class="2xl:px-20 px-4 py-14 my-10">
    <SustainabilityQuestions />
  </section>

    <SustainabilityCertification />


  <div class="mb-10">
    <SustainabilityRelatedTours v-if="relatedTours.length" :tours="relatedTours" />

    <SustainabilityRelatedBlogs />
  </div>
</template>

<script setup lang='js'>
const { getData } = useApi()
const router = useRouter()

const pageData = ref(null)
const data = ref(null);
const isLoading = ref(true)
const { addSeo } = useSeo()

const getPageData = async () => {
  await getData("pages/sustainability").then((res) => {
    pageData.value = res.data
  })
}

getPageData()

addSeo(pageData.value)

const relatedTours = ref([])
relatedTours.value = await getData(`tours?exists=wishlisted&categories.id=64&order_by=display_order,asc&page=1&page_limit=10`).then((res) => {
  return res.data.data
})

</script>

<style scoped lang='scss'>
.textShadow {
  text-shadow: 0 4px 40px #00000066, 0 4px 24px #00000033;
}

.categoryBox {
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.363),
      rgba(0, 0, 0, 0.726));
}
</style>