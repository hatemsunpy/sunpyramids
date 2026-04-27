<template>
  <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

  <SharedMainSwiper title="egyptDayTours" :img="oneDayData?.banner" :imgPhone="oneDayData?.phone_banner" />

  <div class="bg-[#ffffff]">
    <SharedEgyptTours url="destinations?page_limit=200&parent.slug=egypt&order_by=display_order,asc"
      path="/egypt-tours/one-day-tours" />

    <HomeNeedHelp />

    <HomeGallary />
  </div>

  <SharedBottomBar />
</template>

<script setup lang="js">
const breadcrumbItems = [{ title: "home", disabled: false, path: "/" }, { title: "egyTours", disabled: true, path: "/egypt-tours" }, { title: "egyptDayTours", disabled: true, path: "/egypt-tours/one-day-tours" },]
const { getData } = useApi()
const { addSeo } = useSeo()

const oneDayData = ref(null)

oneDayData.value = await getData('pages/one-day-tours?includes=seo').then((res) => {
  return res.data
})

addSeo(oneDayData.value)
</script>

<style scoped lang="scss"></style>
