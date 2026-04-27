<template>
  <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

  <SharedMainSwiper title="nileCruises" :img="nileData?.banner" :imgPhone="nileData?.phone_banner" />

  <div class="bg-[#ffffff]">
    <SharedEgyptTours type="nile"
      url="categories?slug%5B%5D=luxury-nile-cruise&slug%5B%5D=Standard-Nile-Cruises&slug%5B%5D=deluxe-nile-cruise&slug%5B%5D=superior-nile-cruise"
      path="/egypt-tours/nile-cruises" />

    <HomeNeedHelp />
  </div>

  <SharedBottomBar />
</template>

<script setup lang="js">
const breadcrumbItems = [{ title: "home", disabled: false, path: "/" }, { title: "egyTours", disabled: true, path: "/egypt-tours" }, { title: "nileCruises", disabled: true, path: "" },]
const { getData } = useApi()
const { addSeo } = useSeo()

const nileData = ref(null)

const getNileDate = async () => {
  await getData('pages/nile-cruises?includes=seo').then((res) => {
    nileData.value = res.data
    addSeo(nileData.value)
  })
}
getNileDate()
</script>

<style scoped lang="scss"></style>
