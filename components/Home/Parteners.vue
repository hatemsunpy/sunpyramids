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
      <swiper-slide class=" !w-[109.36px ]" v-for="partner in partners" :key="partner.url">
        <img class="w-full h-auto" :src="partner.url" :alt="partner.name + ' logo'" loading="lazy" width="109" height="60" />
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup lang="js">
import { Swiper } from "swiper/vue";
import 'swiper/css'
import 'swiper/css/free-mode'
import { Autoplay, FreeMode } from 'swiper/modules';
const props = defineProps({
  showTitle: {
    type: Boolean,
    default: true,
  },
});
let modules = [Autoplay, FreeMode];

const { getData } = useApi()
const partners = [
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner1.webp", name: "Partner1" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/civitatis.webp", name: "Civitatis" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner.webp", name: "Partner" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner2.webp", name: "Partner2" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner3.webp", name: "Partner3" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner4.webp", name: "Partner4" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner5.webp", name: "Partner5" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner6.webp", name: "Partner6" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner7.webp", name: "Partner7" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner8.webp", name: "Partner8" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner9.webp", name: "Partner9" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner12.webp", name: "Partner12" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/partner99.webp", name: "Partner99" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/tourradar.webp", name: "TourRadar" },
  { url: "https://sunpyramidtours.com/storage/media/pages/assets/partner/viator.webp", name: "Viator" },
];
</script>

<style scoped lang="scss"></style>
