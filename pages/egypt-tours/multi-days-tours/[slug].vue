<template>
  <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

  <SharedMainSwiper :title="multiDaysData?.title" subTitle="multiDays" :directTitle="true" :img="multiDaysData?.banner"
    :imgPhone="multiDaysData?.phone_banner" />

  <EgyptToursMultiDaysTours />

  <div class="bg-white">
    <HomeNeedHelp />

    <HomeGallary />
  </div>

  <SharedBottomBar />
</template>

<script setup lang="js">
const breadcrumbItems = ref([{ title: "home", disabled: false, path: "/" }, { title: "egyTours", disabled: true, path: "/egypt-tours" }, { title: "multiDays", disabled: false, path: "/egypt-tours/multi-days-tours" },])
const { getData } = useApi()
const { addSeo } = useSeo()

const route = useRoute()

const multiDaysData = ref(null)
multiDaysData.value = await getData(`categories/${route.params.slug}?includes=seo`).then((res) => {
  return res.data
})

addSeo(multiDaysData.value)

breadcrumbItems.value.push({ title: multiDaysData.value.title, directTitle: true, disabled: false, path: "" })
</script>

<style scoped lang="scss"></style>