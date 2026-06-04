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
</script>

<style scoped lang="scss"></style>
