<template>
  <div class="bg-[#f9fafb]">
    <EgyptTripLandingGermanHero :img="PageData?.banner" :imgPhone="PageData?.phone_banner" />

    <EgyptTripLandingGermanWhy />

    <LazyEgyptTripLandingGermanSelectedTours />

    <LazyEgyptTripLandingGermanContactUs />

    <div class="w-full py-20 xl:px-20" id="home-reviews" ref="trustindexContainer"></div>

    <LazyHomeGallary />
  </div>
</template>

<script setup lang='js'>
const { getData } = useApi()
const { addSeo } = useSeo()
const PageData = ref([])
PageData.value = await getData('pages/plan-your-egypt-journey?includes=seo').then((res) => {
  return res.data
})

addSeo(PageData.value)

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