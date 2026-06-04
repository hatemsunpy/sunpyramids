<template>
  <section v-if="tour" class="select-none">
    <swiper :spaceBetween="10" @slide-change="pause" :navigation="true" :thumbs="{ swiper: thumbsSwiper }"
      :modules="modules" class="tourSwiper2 md:group">
      <swiper-slide
        class="md:rounded-2xl rounded-none border w-full md:min-h-[36.25rem] md:max-h-[36.25rem] overflow-hidden "
        v-for="(img, index) in tour?.gallery" :key="index">
        <!-- <img v-if="!item.video" :src="item.photo" class="w-full h-full object-cover" /> -->
        <img :src="img" class="w-full md:min-h-[36.25rem] md:max-h-[36.25rem] object-cover object-top" :loading="index === 0 ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : 'auto'" width="1000" height="580" style="aspect-ratio: 16 / 9;" />

        <!-- <UIVideo :class="'min-h-[26.25rem] max-h-[26.25rem]'" :timeNow="timeNow" v-else :photo="item.photo"
          :video="item.video" /> -->

        <div class="absolute top-4 flex lg:hidden gap-4 right-4">
          <button class="w-11 h-11  rounded-full bg-[#ffffff] flex justify-center items-center" @click="likeTour">
            <NuxtIcon name="heart-nonfill" class="text-xl text-[#DEDEDE] w-5 h-5" />
          </button>

          <button class="w-11 h-11 rounded-full bg-[#ffffff] flex justify-center items-center" @click="shareTour">
            <NuxtIcon name="send" class="text-xl w-5 h-5" />
          </button>
        </div>

        <button @click="isOpen = true, pause()"
          class="w-[2rem] h-[2rem] bg-[#1D1F1FCC] rounded-full absolute bottom-4 right-4 hover:bg-[#143485] transition-all lg:opacity-0 opacity-100 group-hover:opacity-100 text-white flex justify-center items-center">
          <NuxtIcon name="maximize" />
        </button>
      </swiper-slide>
    </swiper>

    <swiper ref="tourSwiper" :navigation="true" @swiper="setThumbsSwiper" :breakpoints="{
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
    }" :freeMode="true" :modules="modules" class="tourSwiper">
      <swiper-slide v-for="(img, index) in tour?.gallery" :key="index" class="relative">
        <img :src="img" class="w-full h-full object-cover " loading="lazy" width="64" height="64" style="aspect-ratio: 1 / 1;" />

        <!-- <div v-if="item.video"
          class="absolute bg-[#1D1F1FCC] flex justify-center items-center  rounded-full w-5 h-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <NuxtIcon name="play" class="text-white text-[8px]" />
        </div> -->
      </swiper-slide>
    </swiper>
  </section>

  <UISwiperModal @close="isOpen = false" v-if="isOpen" :data="tour" />
</template>

<script setup lang="js">
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
const modules = [FreeMode, Navigation, Thumbs];

const toast = useNuxtApp().$toast


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
  tour: {
    type: Object
  }
})

const tour = ref(null)
watch(() => props.tour, (newVal) => {
  if (newVal) tour.value = newVal
}, {
  deep: true,
  immediate: true
})


const shareTour = async () => {
  navigator.share({
    title: document.title,
    text: 'Check this out!',
    url: window.location.href,
  });
};

const likeTour = () => {
  const token = useCookie('sunpyramids-token').value
  if (!token) {
    toast.error('Please login to like the tour')
    return
  }
}

// const data = [{ photo: "/images/tour.webp", video: "" }, { photo: "/images/tour.webp", video: "/images/test-video.mp4" }, { photo: "/images/tour.webp", video: "" }, { photo: "/images/tour.webp", video: "/images/test-video.mp4" }, { photo: "/images/tour.webp", video: "" }, { photo: "/images/tour.webp", video: "/images/test-video.mp4" }, { photo: "/images/tour.webp", video: "" }, { photo: "/images/tour.webp", video: "/images/test-video.mp4" }, { photo: "/images/tour.webp", video: "" }, { photo: "/images/tour.webp", video: "/images/test-video.mp4" }, { photo: "/images/tour.webp", video: "" }, { photo: "/images/tour.webp", video: "/images/test-video.mp4" }, { photo: "/images/tour.webp", video: "" }, { photo: "/images/tour.webp", video: "/images/test-video.mp4" }, { photo: "/images/tour.webp", video: "" }, { photo: "/images/tour.webp", video: "/images/test-video.mp4" },]
</script>

<style scoped lang="scss"></style>
<style lang="scss">
.tourSwiper2 {
  @apply md:mb-2 md:rounded-2xl overflow-hidden;

  .swiper-button-next::after,
  .swiper-button-prev::after {
    @apply bg-[#1D1F1FCC] min-w-11 text-lg min-h-11 me-2 md:flex items-center justify-center rounded-full text-white hidden;
  }

  .swiper-button-prev::after {
    @apply ms-4;
  }

}

.tourSwiper {
  .swiper-slide {
    @apply h-16 min-w-16 cursor-pointer max-w-16 opacity-50 transition-all rounded-lg overflow-hidden;
  }

  .swiper-slide:hover:not(.swiper-slide-thumb-active) {
    @apply opacity-100 border-2 border-[#A6BCF2];
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    @apply bg-white min-w-8 text-xs min-h-8 me-2 md:flex items-center justify-center rounded-full hidden text-textDark;
  }

  .swiper-button-prev::after {
    @apply ms-4;
  }

  .swiper-slide-thumb-active {
    @apply opacity-100 border-2 border-primary;

  }
}
</style>
