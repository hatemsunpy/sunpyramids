<template>
  <section class="py-12">
    <h3 v-if="props.showTitle" class="xl:text-5xl text-3xl  font-bold text-center xl:mb-20 mb-5">
      {{ $t("labels.ourPartners") }}
    </h3>

    <swiper :modules="modules" class="!ps-20" :autoplay="{
      delay: 3000,
      disableOnInteraction: false,
    }" :breakpoints="{
      '30': {
        slidesPerView: 2.5,
        spaceBetween: 20,
      },
      '768': {
        slidesPerView: 5.5,
        spaceBetween: 40,
      },
      '1024': {
        slidesPerView: 6.75,
        spaceBetween: 20,
      },
    }" :freeMode="true">
      <swiper-slide class=" !w-[109.36px ]" v-for="partner in partners" :key="partner">
        <NuxtImg class=" w-full" :src="partner" />
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup lang="js">
import { Swiper } from "swiper/vue";
import { Autoplay, FreeMode } from 'swiper/modules';
import "swiper/css";
const props = defineProps({
  showTitle: {
    type: Boolean,
    default: true,
  },
});
let modules = [Autoplay, FreeMode];

const { getData } = useApi()
const partners = [
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner1.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/civitatis.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner2.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner3.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner4.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner5.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner6.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner7.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner8.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner9.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner12.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner99.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/tourradar.webp",
  "https://sunpyramidtours.com/storage/media/pages/assets/partner/viator.webp",
];
</script>

<style scoped lang="scss"></style>
