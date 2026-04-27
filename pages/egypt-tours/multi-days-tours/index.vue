<template>
  <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

  <SharedMainSwiper :title="$t('labels.multiDays')" :directTitle="true" :img="multiDayData?.banner"
    :imgPhone="multiDayData?.phone_banner" />

  <div class="bg-[#ffffff]">
    <SharedEgyptTours url="categories?parent_id=3&page_limit=100" path="/egypt-tours/multi-days-tours" />

    <HomeNeedHelp />

    <HomeGallary />

  </div>
  <SharedBottomBar />
</template>

<script setup lang="js">
const breadcrumbItems = [{ title: "home", disabled: false, path: "/" }, { title: "egyTours", disabled: true, path: "/egypt-tours" }, { title: "multiDays", disabled: true, path: "" },]
const { getData } = useApi()
const { addSeo } = useSeo()

const multiDayData = ref(null)
multiDayData.value = await getData('categories/multi-days-tours?includes=seo').then((res) => {
  return res.data
})

addSeo(multiDayData.value)

</script>

<style scoped lang="scss"></style>