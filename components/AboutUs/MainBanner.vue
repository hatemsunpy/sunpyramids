<template>
  <section class="w-full bg-[url('../../assets/imgs/bg.svg')] text-center bg-no-repeat bg-cover pt-5 pb-[4.5rem]">
    <h1 class="lg:text-[1.875rem] w-1/2 mx-auto text-xl mb-5 font-medium">{{ $t("labels.about") }}</h1>

    <h3 class="lg:text-5xl text-3xl w-[65%] mx-auto text-[#444444] font-bold lg:mb-5 mb-1">
      {{ $t("labels.aboutus.banner.fline") }}
    </h3>

    <h3 class="lg:text-5xl text-3xl w-[65%] mx-auto text-[#444444] font-bold mb-[4.5rem]">
      {{ $t("labels.over") }}
      <span class="text-secondary">{{
        $t("labels.aboutus.banner.slineColor")
      }}</span>
      {{ $t("labels.aboutus.banner.sline") }}
    </h3>

    <swiper v-if="props.gallery.length > 0" :modules="modules" class="lg:!px-20 !px-3" :autoplay="{
      delay: 3000,
      disableOnInteraction: false,
    }" :breakpoints="{
      '30': {
        slidesPerView: 1.5,
        spaceBetween: 20,
      },
      '768': {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      '1024': {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      '1556': {
        slidesPerView: 3.25,
        spaceBetween: 20,
      },
    }" :freeMode="true">
      <swiper-slide class="rounded-[2.25rem] overflow-hidden" v-for="img in props.gallery" :key="img">
        <img class="h-[20.75rem] object-cover" :src="img" :alt="props.altText" />
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup lang="js">
import { Swiper } from "swiper/vue";
import { Autoplay, FreeMode } from 'swiper/modules';
import "swiper/css";
let modules = [Autoplay, FreeMode];


const props = defineProps({
  gallery: {
    type: Array,
    required: true,
    default: () => []
  },
  altText: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss"></style>
