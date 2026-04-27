<template>
  <section class="bg-[#f9fafb]">
    <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

    <EventsHero :img="PageData?.banner" :imgPhone="PageData?.phone_banner" :title="PageData?.title" />

    <EventsDescription v-if="PageData?.short_description" :description="PageData?.short_description" />

    <EventsList />

    <div class="">
      <EventsGallary v-if="PageData?.gallery && PageData?.gallery.length" :gallary="PageData?.gallery" />

      <div class="xl:py-16 py-4">
        <h3 class="xl:text-5xl text-3xl  font-bold text-center xl:mb-20 mb-5">
          {{ $t("labels.ClientsFeedback") }}
        </h3>

        <div class="w-full xl:px-20 bg-w" id="home-reviews" ref="trustindexContainer"></div>
      </div>


      <LazyHomeFrequentlyAsked url="faqs/home?page_limit=5" path="/faqs" />

      <LazyHomeParteners />
    </div>

  </section>
</template>

<script setup>
const breadcrumbItems = ref([{ title: "home", disabled: false, path: "/" },])

const { getData } = useApi()
const { addSeo } = useSeo()
const PageData = ref([])
PageData.value = await getData('pages/events?includes=seo').then((res) => {
  return res.data
})


addSeo(PageData.value)
breadcrumbItems.value.push({ title: PageData.value.title, directTitle: true, disabled: true, path: "" })

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

<style scoped lang='scss'></style>