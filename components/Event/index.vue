<template>
  <section class="bg-[#f9fafb]">
    <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

    <EventHero :img="pageData?.banner" :imgPhone="pageData?.phone_banner" :title="pageData?.title"
      :date="pageData?.date" />

    <div class=" 2xl:px-20 px-4 py-8 grid lg:grid-flow-col  2xl:grid-cols-8 grid-cols-8 relative gap-5 bg-white">
      <div class="2xl:col-span-6 lg:col-span-5  col-span-8 ">
        <h2 class="xl:py-8 py-3 text-primary font-medium lg:text-[34px] text-xl">{{ pageData?.title }}</h2>

        <div v-html="pageData?.description" class="breakWord"></div>
      </div>

      <EventRightPanal :data="pageData" />
    </div>
    <EventRelatedTours v-if="relatedTours.length" :tours="relatedTours" />

    <EventGallary v-if="pageData?.gallery && pageData?.gallery.length" :gallary="pageData?.gallery" />

    <EventRelatedBlogs />

    <div class="py-6 bg-white">
      <div class=" lg:px-20 px-4 mb-4">
        <h3 class="text-[2.125rem] font-bold">
          {{ $t("labels.ClientsFeedback") }}
        </h3>
      </div>


      <div class="w-full xl:px-20 bg-w" id="home-reviews" ref="trustindexContainer"></div>
    </div>
  </section>
</template>

<script setup lang='js'>
const { getData } = useApi()
const { addSeo } = useSeo()

const breadcrumbItems = ref([{ title: "home", disabled: false, path: "/" },])
const route = useRoute()
const pageData = ref(null)

await getData('pages/events?includes=seo').then((res) => {
  breadcrumbItems.value.push({ title: res.data.title, directTitle: true, disabled: false, path: "/events" })
})


pageData.value = await getData(`categories/${route.params.slug}?includes=seo`).then((res) => {
  return res.data
})

breadcrumbItems.value.push({ title: pageData.value.title, directTitle: true, disabled: true, path: "" })
addSeo(pageData.value)

const relatedTours = ref([])
relatedTours.value = await getData(`tours?exists=wishlisted&categories.id=${pageData.value.id}&order_by=display_order,asc&page=1&page_limit=10`).then((res) => {
  return res.data.data
})

const trustindexContainer = ref(null);

onMounted(() => {
  // Check if running on client side
  if (process.client) {
    const script = document.createElement('script');
    script.src = 'https://cdn.trustindex.io/loader.js?1d15b034519c8049128609a4d4e';
    script.async = true;
    script.defer = true;

    // Add data attributes if needed by TrustIndex
    script.setAttribute('data-type', 'stripe');
    script.setAttribute('data-location', 'home-reviews');

    trustindexContainer.value.appendChild(script);
  }
});
</script>

<style scoped lang='scss'>
.breakWord{
  word-break: break-word;
}
</style>