<template>
  <section class=" xl:py-14 py-4 bg-white">
    <div class=" xl:px-20 px-6 xl:pb-10">
      <h3 class="xl:text-5xl text-3xl font-bold text-center">
        {{ $t("labels.egyptGallery") }}
      </h3>
    </div>

    <swiper v-if="props.gallary && props.gallary.length" :modules="modules" class="reviewsToursSwiper xl:!px-20 !px-4"
      :pagination="{ clickable: true }" :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }" :breakpoints="{
        '30': {
          slidesPerView: 1.5,
          spaceBetween: 16,
        },
        '768': {
          slidesPerView: 2.5,
          spaceBetween: 16,
        },
        '1024': {
          slidesPerView: 3,
          spaceBetween: 16,
        },
        '1352': {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        '1624': {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      }" :freeMode="true">
      <swiper-slide class=" group !h-[24.375rem]  rounded-2xl overflow-hidden" v-for="img in props.gallary">
        <div class="h-full">
          <img :src="img" class="w-full !h-full object-cover" />
        </div>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup lang="js">
import { Swiper } from "swiper/vue";
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';
const props = defineProps({
  gallary: {
    type: Array,
    default: () => [],
  }
})
let modules = [Pagination, Autoplay, FreeMode];
</script>


<style scoped lang="scss"></style>

<style lang="scss">
.absoluteTextShadow {
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.25);
}

.reviewsToursSwiper {
  @apply w-full h-full relative mt-6;

  .swiper-pagination-fraction,
  .swiper-pagination-custom,
  .swiper-horizontal>.swiper-pagination-bullets,
  .swiper-pagination-bullets.swiper-pagination-horizontal {
    @apply bottom-0;
  }

  .swiper-pagination-bullet-active {
    width: 2rem !important;
  }

  .swiper-pagination {
    @apply flex justify-center mt-8 relative;
  }

  .swiper-pagination-bullet {
    @apply bg-[#DEDEDE] w-[16px] h-[16px] rounded-full opacity-100 transition-all;
  }

  .swiper-pagination-bullet-active {
    @apply bg-secondary;
  }
}
</style>
