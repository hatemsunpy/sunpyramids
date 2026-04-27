<template>
  <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

  <SharedMainSwiper :title="distination?.title" subTitle="nileCruises" :directTitle="true" :img="distination?.banner"
    :imgPhone="distination?.phone_banner" />

  <EgyptToursNileTours />

  <div class="bg-white">
    <HomeNeedHelp />

    <HomeGallary />

  </div>
  <SharedBottomBar />

</template>

<script setup lang="js">
const route = useRoute()
const { getData } = useApi()
const { addSeo } = useSeo()

const distination = ref(null)
const getDistination = async () => {
  await getData(`categories/${route.params.slug}`, { includes: 'seo,children' }).then((res) => {
    distination.value = res.data
    breadcrumbItems.value.push({ title: distination.value?.title, directTitle: true, disabled: false, path: "" })
    addSeo(distination.value)

  })
}
getDistination()
const breadcrumbItems = ref([{ title: "home", disabled: false, path: "/" }, { title: "egyTours", disabled: true, path: "/egypt-tours" }, { title: "nileCruises", disabled: false, path: "/egypt-tours/nile-cruises" },])
</script>

<style scoped lang="scss"></style>
