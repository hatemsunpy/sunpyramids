<template>
  <div class="bg-[#f9fafb]">
    <HomeMainBanner />

    <SharedSpecialEvents SeeMore="/egypt-tours/multi-days-tours/easter-packages"
      :title="$t('labels.specialEventsData.title')"
      :description="$t('labels.specialEventsData.desc')"
      url="tours?exists=wishlisted&categories.id=59&order_by=display_order,asc&page=1&page_limit=4" />

    <HomePopularDistnation />

    <LazyHomeMakeYourTrip />

    <LazyHomeSpecialOffers />

    <div class="bg-white">
      <LazyHomeBookingSteps />

      <LazyHomeHighlights />
    </div>



    <LazyHomeTravelBlogs />

    <LazyHomeCertificationOverview />


    <LazyHomeGallary />

    <ClientOnly>
      <div class="w-full xl:px-20" id="home-reviews" ref="trustindexContainer"></div>
    </ClientOnly>

    <LazyHomeFrequentlyAsked url="faqs/home?page_limit=5" path="/faqs" />

    
    
    <LazyHomeNeedHelp />

    

    <LazyHomeParteners :showTitle="false" />
  </div>

  <SharedBottomBar />
</template>

<script setup lang="js">
const trustindexContainer = ref(null);

// const { getData } = useApi()
// const { addSeo } = useSeo()
// const homeData = ref([])
// homeData.value = await getData('pages/home?includes=seo').then((res) => {
//   return res.data
// })

// addSeo(homeData.value)

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

<style scoped lang="scss"></style>
