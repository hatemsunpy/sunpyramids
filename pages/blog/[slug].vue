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
if (blog.value) {
  addSeo(blog.value)
  
  // Preload LCP main banner image
  useHead({
    link: blog.value.featured_image ? [
      {
        rel: 'preload',
        as: 'image',
        href: `/_ipx/w_1024,f_webp/${blog.value.featured_image}`,
        imagesrcset: `/_ipx/w_320,f_webp/${blog.value.featured_image} 320w, /_ipx/w_640,f_webp/${blog.value.featured_image} 640w, /_ipx/w_768,f_webp/${blog.value.featured_image} 768w, /_ipx/w_1024,f_webp/${blog.value.featured_image} 1024w`,
        imagesizes: 'xs:320px sm:640px md:768px lg:1024px'
      }
    ] : []
  })
}
</script>

<style scoped lang="scss"></style>
