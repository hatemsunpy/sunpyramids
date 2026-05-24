<template>
  <section class="relative w-full bg-[#f9fafb] pb-2 bg-center">
    <div class=" bg-transparent">
      <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />
    </div>

    <div class="2xl:px-20 lg:px-4 px-0 ">
      <swiper :spaceBetween="10" :navigation="true" :pagination="{ clickable: true }" :modules="modules"
        class="blogSwiper group ">
        <swiper-slide class="lg:rounded-2xl border w-full lg:h-[566px] h-96 overflow-hidden " v-for="image in 1">
          <div>
            <img :src="page?.featured_image" class="!w-full lg:h-[566px] h-96 object-cover object-top" alt="" loading="eager" fetchpriority="high" />
          </div>
          <div class="w-full linearBG h-[70%] flex items-end absolute bottom-0 right-0">
            <div class="text-white text-start w-full font-medium pb-[2.375rem] lg:px-20 px-6 textShadow">
              <h1 class="lg:text-[2.125rem] text-2xl mb-6 lg:leading-[46.57px] leading-[150%]">
                {{ page?.title }}
              </h1>

              <p class="lg:leading-6 leading-[100%] lg:text-base text-sm ps-1 lg:mb-[3.75rem] ">{{
                formatDate(page?.created_at) == 'Invalid Date'
                  ?
                  '' :
                  formatDate(page?.created_at) }}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <!-- v-for="image in page?.gallery"> -->
  </section>
</template>

<script setup lang="js">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
const modules = [Navigation, Pagination];
const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})
const data = computed(() => {
  return props.data
})
const breadcrumbItems = ref([{ title: "home", disabled: false, path: "/" }, { title: "blogs", disabled: false, path: "/egypt-travel-guide" },])

const page = ref(null)

watch(data, (value) => {
  breadcrumbItems.value = [...breadcrumbItems.value, { title: value.title, directTitle: true, disabled: true, path: "" },]
  page.value = value
}, { immediate: true })
function formatDate(isoString) {
  const date = new Date(isoString);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };

  return date.toLocaleDateString('en-GB', options).replace(',', '');
}
</script>

<style scoped lang="scss">
.linearBG {
  background: linear-gradient(to bottom,
      #00000000 0%,
      #0000007e 68.5%,
      #000000a9 100%);
}
</style>

<style lang="scss">
.blogSwiper {
  @apply mb-2 lg:rounded-2xl overflow-hidden lg:h-[566px] h-96;

  .swiper-button-next::after,
  .swiper-button-prev::after {
    @apply bg-[#1D1F1FCC] min-w-11 text-lg min-h-11 me-10 flex items-center justify-center rounded-full text-white;
  }

  .swiper-button-prev::after {
    @apply ms-10 me-0;
  }

  .swiper-pagination-fraction,
  .swiper-pagination-custom,
  .swiper-horizontal>.swiper-pagination-bullets,
  .swiper-pagination-bullets.swiper-pagination-horizontal {
    @apply bottom-16;
  }

  .swiper-pagination {
    @apply flex justify-center mt-8 relative;
  }

  .swiper-pagination-bullet {
    @apply bg-[#DEDEDE] w-[11px] h-[11px] rounded-full opacity-100;
  }

  .swiper-pagination-bullet-active {
    @apply bg-secondary;
  }

}
</style>
