<template>
  <section class="fixed top-0 left-0 z-[99999] w-full h-screen bg-[#3e3e3e] flex items-center opacity-[0.99]">
    <div class="w-[100%] -translate-y-10 lg:!h-[60vh]    mx-auto">
      <h5 class="mb-10 text-white textShadow font-medium w-3/4 mx-auto text-xl text-center">{{ props.data?.title }}</h5>
      <swiper :spaceBetween="10" @slide-change="pause" :navigation="true" :thumbs="{ swiper: thumbsSwiper }"
        :modules="modules" class="tourSwiperModal2 group ">
        <swiper-slide class="  w-full lg:!h-[60vh]   " v-for="item in props.data?.gallery">
          <div class="lg:w-[60%] mx-auto lg:rounded-2xl overflow-hidden">
            <!-- <img v-if="!item.video" :src="item.photo" class="w-full  !h-[60vh] object-cover" /> -->
            <img :src="item" class="w-full  lg:!h-[60vh]  object-cover" />

            <!-- <UIVideo :class="'min-h-[60vh] max-h-[60vh]'" :timeNow="timeNow" v-else :photo="item.photo"
              :video="item.video" /> -->
          </div>
        </swiper-slide>
      </swiper>

      <swiper ref="tourSwiper" @swiper="setThumbsSwiper" :breakpoints="{
        '30': {
          slidesPerView: 7,
          spaceBetween: 8,
        },
        '768': {
          slidesPerView: 8,
          spaceBetween: 8,
        },
        '1024': {
          slidesPerView: 10,
          spaceBetween: 8,
        },
        '1686': {
          slidesPerView: 16,
          spaceBetween: 8,
        },
      }" :freeMode="true" :modules="modules" class="tourSwiperModal">
        <swiper-slide v-for="item in props.data?.gallery" class="relative">
          <img :src="item" class="w-full h-full object-cover " />
          <!-- <img :src="item.photo" class="w-full h-full object-cover " /> -->

          <!-- <div v-if="item.video"
            class="absolute bg-[#1D1F1FCC] flex justify-center items-center  rounded-full w-5 h-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <NuxtIcon name="play" class="text-white text-[8px]" />
          </div> -->
        </swiper-slide>
      </swiper>
    </div>

    <button @click="emits('close')"
      class="text-textDark bg-[#f9e7e8] flex items-center justify-center lg:w-12 h-8 lg:h-12 w-8 rounded-full absolute lg:top-16 top-5  right-5 lg:right-28">
      <NuxtIcon name="add" class="text-xl rotate-45" />
    </button>
  </section>
</template>

<script setup lang='js'>import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
const modules = [FreeMode, Navigation, Thumbs];

const thumbsSwiper = ref(null);
const timeNow = ref(Date.now());

const isOpen = ref(false)

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

const tourSwiper = ref(null)


const pause = () => {
  timeNow.value = Date.now()
}
const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const emits = defineEmits(["close"])
</script>

<style scoped lang='scss'>
.textShadow {
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.25) !important;
}
</style>
<style lang='scss'>
.tourSwiperModal2 {
  @apply mb-10 lg:rounded-2xl;

  .swiper-button-next {
    @apply hidden lg:flex;
    right: 40px;
  }

  .swiper-button-prev {
    @apply hidden lg:flex;
    left: 40px;
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    @apply hover:bg-primary border-white border transition-all hover:border-primary min-w-[4.5rem] h-[4.5rem] text-xl me-2 flex items-center justify-center rounded-full text-white;
  }

  .swiper-button-prev::after {
    @apply ms-4;
  }

}

.tourSwiperModal {
  .swiper-wrapper {
    @apply lg:justify-center;
  }

  .swiper-slide {
    @apply h-16 min-w-16 cursor-pointer max-w-16 opacity-50 transition-all rounded-lg overflow-hidden justify-center;
  }

  .swiper-slide:hover:not(.swiper-slide-thumb-active) {
    @apply opacity-100 border-2 border-[#A6BCF2];
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    @apply bg-white min-w-8 text-xs min-h-8 me-2 flex items-center justify-center rounded-full text-textDark;
  }

  .swiper-button-prev::after {
    @apply ms-4;
  }

  .swiper-slide-thumb-active {
    @apply opacity-100 border-2 border-primary;

  }
}
</style>