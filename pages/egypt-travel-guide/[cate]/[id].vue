<template>
  <div v-if="page" class="bg-white">
    <BlogsCategoryMainBanners :data="page" />

    <BlogsCategoryBlogs />
  </div>

  <SharedBottomBar />
</template>

<script setup lang="js">import { createError } from 'h3'


const { t } = useI18n()
const route = useRoute()
const { getData } = useApi()
const { addSeo } = useSeo()
const page = ref(null)

const abort_404 = () => {
  useError().value = createError({
    statusCode: 404,
    statusMessage: t('errors.notFound')
  })
}

await getData(`blog-categories?slug%5B%5D=${route.params.cate}&exists=children&page_limit=1`).then((res) => {
  if (!res.data.data[0]) {
    abort_404()
  }
})


await getData(`blog-categories?slug%5B%5D=${route.params.id}&includes=seo&exists=children&page_limit=100`).then((res) => {
  if (res.data.data[0]) {
    page.value = res.data.data[0]
    addSeo(page.value)
  } else {
    abort_404()
  }
})



</script>

<style scoped lang="scss"></style>