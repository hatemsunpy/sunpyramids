<template>
  <template v-if="blog">
    <BlogsBlogMainBanner :data="blog" />

    <BlogsBlog :data="blog?.description" :title="blog?.title" />

    <ToursLeftPanalRelated :tours="blog?.related_tours" />

    <HomeFrequentlyAsked :url="`faqs?page_limit=5&tag%5B%5D=blogs.general&tag%5B%5D=blogs.${route.params.slug}`"
      path="/faqs" />

    <div class="bg-[#f9fafb]">
      <BlogsBlogRelated />
    </div>

    <div class="bg-[#ffffff]">
      <HomeNeedHelp />
    </div>
  </template>

  <SharedError v-if="isError" :title="$t('errors.notFoundBlog')" />

  <SharedBottomBar />
</template>

<script setup lang="js">
import { createError } from 'h3'

definePageMeta({
  name: 'blog-slug' // Now this name will work
})
const { getData } = useApi()
const route = useRoute()
const { t } = useI18n()


const abort_404 = () => {
  useError().value = createError({
    statusCode: 404,
    statusMessage: t('errors.notFoundBlog')
  })
}

const blog = ref(null)
const isError = ref(false)

await getData(`blogs/${route.params.slug}?includes=seo,relatedTours`).then((res) => {
  blog.value = res.data
}).catch((error) => {
  // isError.value = true
  abort_404()
  console.error(error)
})

const { addSeo } = useSeo()
// Preload LCP main banner image using @nuxt/image so the URL format
// adapts to the active provider (Vercel /_vercel/image or IPX)
const img = useImage()

if (blog.value) {
  addSeo(blog.value)

  if (blog.value.featured_image) {
    const preloadHref = img(blog.value.featured_image, { width: 1024, format: 'webp', quality: 80 })

    useHead({
      link: [
        {
          rel: 'preload',
          as: 'image',
          href: preloadHref,
        }
      ]
    })
  }
}
</script>

<style scoped lang="scss"></style>