<template>
  <section class=" py-6 bg-white">
    <div class=" lg:px-20 px-4">
      <h4 class="text-[2.125rem] font-bold">
        {{ $t("labels.tours.related") }}
      </h4>
    </div>

    <swiper v-if="tours && tours.length != 0" :modules="modules" class="reviewsToursSwiper lg:!px-20 !px-4"
      :pagination="{ clickable: true }" :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }" :breakpoints="{
        '30': {
          slidesPerView: 1.5,
          spaceBetween: 20,
        },
        '768': {
          slidesPerView: 2.5,
          spaceBetween: 20,
        },
        '1024': {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        '1352': {
          slidesPerView: 3.75,
          spaceBetween: 20,
        },
        '1624': {
          slidesPerView: 4.5,
          spaceBetween: 20,
        },
        1824: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      }" :freeMode="true">
      <swiper-slide class="w-[15rem] group cursor-pointer h-[15rem] rounded-2xl overflow-" v-for="tour in tours"
        :key="tour.id">
        <SharedTourCard :item="tour" :showTimer="false" />
      </swiper-slide>

      <!-- <div class="w-full mt-6 h-[2px] bg-[#EEEEEE]"></div> -->
    </swiper>

  </section>
</template>

<script setup lang="js">
import { Swiper } from "swiper/vue";
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';
let modules = [Pagination, Autoplay, FreeMode];

const props = defineProps({
  tours: {
    type: Array,
    default: []
  }
})

const tours = computed(() => {
  return props.tours
})
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
