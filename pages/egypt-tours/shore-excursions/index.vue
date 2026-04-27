<template>
  <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

  <SharedMainSwiper :title="$t('labels.shoreExsurision')" :directTitle="true" :img="shoreData?.banner"
    :imgPhone="shoreData?.phone_banner" />

  <EgyptToursShoreTours />

  <div class="bg-white">
    <HomeNeedHelp />
  </div>

  <SharedBottomBar />
</template>

<script setup lang="js">
const breadcrumbItems = [{ title: "home", disabled: false, path: "/" }, { title: "egyTours", disabled: true, path: "/egypt-tours" }, { title: "shoreExsurision", disabled: true, path: "" },]
const { getData } = useApi()
const { addSeo } = useSeo()

const shoreData = ref(null)

const getShoreDate = async () => {
  await getData('categories/shore-excursions?includes=seo').then((res) => {
    shoreData.value = res.data
    addSeo(shoreData.value)
  })
}
getShoreDate()
</script>

<style scoped lang="scss"></style>