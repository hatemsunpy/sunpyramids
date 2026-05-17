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

watch(tour, (newVal) => {
  if (newVal) {
    breadcrumbItems.value = [...breadcrumbItems.value, { title: newVal.title, directTitle: true, disabled: true, path: "" },]
    
    addSeo(newVal)

    // Preload the first Swiper hero image as the LCP element
    if (newVal.gallery && newVal.gallery[0]) {
      useHead({
        link: [
          {
            rel: 'preload',
            as: 'image',
            href: `/_ipx/w_1024,f_webp/${newVal.gallery[0]}`,
            imagesrcset: `/_ipx/w_320,f_webp/${newVal.gallery[0]} 320w, /_ipx/w_640,f_webp/${newVal.gallery[0]} 640w, /_ipx/w_768,f_webp/${newVal.gallery[0]} 768w, /_ipx/w_1024,f_webp/${newVal.gallery[0]} 1024w`,
            imagesizes: 'xs:320px sm:640px md:768px lg:1024px'
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
