<template>
  <div class="bg-white">
    <BlogsCategoriesMainBanner :image="page?.banner" />

    <BlogsCategoriesSearchInput />

    <BlogsCategories :id="page?.id" />
  </div>

  <SharedBottomBar />
</template>

<script setup lang="js">
const { getData } = useApi()
const { addSeo } = useSeo()
const page = ref(null)

const getPlogPage = async () => {
  getData("pages/blog?includes=seo").then((res) => {
    page.value = res.data
    addSeo(page.value)
  })
}

getPlogPage()
</script>

<style scoped lang="scss"></style>
