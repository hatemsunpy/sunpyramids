<template>
  <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

  <Tours v-if="tour" :tour="tour" />

  <SharedError v-if="isError" :title="$t('errors.notFoundTour')" />
</template>

<script setup lang="js">
import { createError } from 'h3'

const { t } = useI18n()
const breadcrumbItems = ref([{ title: "home", disabled: false, path: "/" }, { title: "trips.tours", disabled: false, path: "/trips" },])

const abort_404 = () => {
  useError().value = createError({
    statusCode: 404,
    statusMessage: t('errors.notFoundTour')
  })
}

const { getData } = useApi()
const { addSeo } = useSeo()

const route = useRoute()

const tour = ref(null)
const isError = ref(false)

await getData(`tours/${route.params.id}?includes=seo,destinations,categories,options,days,seasons`).then((res) => {
  tour.value = res.data
}).catch((error) => {
  // isError.value = true
  abort_404()
  console.error(error)
})

// Preload the first gallery image as the LCP element using @nuxt/image
// so the URL format adapts to the active provider (Vercel /_vercel/image or IPX)
const img = useImage()

watch(tour, (newVal) => {
  if (newVal) {
    breadcrumbItems.value = [...breadcrumbItems.value, { title: newVal.title, directTitle: true, disabled: true, path: "" },]

    addSeo(newVal)

    if (newVal.gallery && newVal.gallery[0]) {
      const src = newVal.gallery[0]
      const preloadHref = img(src, { width: 1024, format: 'webp', quality: 80 })

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
},
  { immediate: true }
)
</script>

<style scoped lang="scss"></style>