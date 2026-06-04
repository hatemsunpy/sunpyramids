<template>
  <section class=" py-6 bg-white">
    <div class=" xl:px-20 px-6">
      <h4 class="text-[2.125rem] font-bold">
        {{ $t("labels.tours.gallary") }}
      </h4>
    </div>

    <swiper v-if="props.socials && props.socials.length" :modules="modules" class="reviewsToursSwiper xl:!px-20 !px-4"
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
      <swiper-slide class=" group cursor-pointer !h-[24.375rem]  rounded-2xl overflow-hidden"
        v-for="(item, index) in props.socials" :key="index">
        <div class="h-full">
          <img :src="item.image ? item.image : getStyles(item.type) ? getStyles(item.type).img : ''"
            @click="getSpecialLink(item.url)" class="w-full !h-full object-cover" loading="lazy" width="300" height="390" />

          <NuxtImg :src="getStyles(item.type) ? getStyles(item.type).icon : ''" @click="getSpecialLink(item.url)"
            class="absolute w-[4.5rem] h-[4.5rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" loading="lazy" />
        </div>
      </swiper-slide>

      <div class="w-full mt-6 h-[2px] bg-[#EEEEEE]"></div>
    </swiper>

    <swiper v-else :modules="modules" class="reviewsToursSwiper xl:!px-20 !px-4" :pagination="{ clickable: true }"
      :autoplay="{
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
      <swiper-slide class=" group cursor-pointer !h-[24.375rem]  rounded-2xl overflow-hidden"
        v-for="(item, index) in gallaryMob" :key="index">
        <div class="h-full">
          <NuxtImg :src="item?.img" class="w-full !h-full object-cover" loading="lazy" sizes="xs:250px sm:300px" />

          <NuxtImg :src="item?.icon" @click="getLink(item.value)"
            class="absolute w-[4.5rem] h-[4.5rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" loading="lazy" />
        </div>
      </swiper-slide>

      <div class="w-full mt-6 h-[2px] bg-[#EEEEEE]"></div>
    </swiper>

  </section>
</template>

<script setup lang="js">
import { Swiper } from "swiper/vue";
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';
const props = defineProps({
  socials: {
    type: Array,
    default: () => [],
  }
})
let modules = [Pagination, Autoplay, FreeMode];

const { settings } = storeToRefs(sharedStore())

const getLink = (value) => {
  if (settings.value) {
    const url = settings.value.find((setting) => setting.option_key == "social_links").option_value.find((v) => v.type == value).url
    window.open(url, '_blank')
  }
}

const gallary = [{ img: "/images/shorts.webp", icon: "/images/shorts-gallary.png", value: "shorts" }, { img: "/images/youtubeone.png", icon: "/images/youtube-gallary.png", value: "youtube-video-1" }, { img: "/images/tiktok.webp", icon: "/images/tiktok-gallary.png", value: "tiktok" }, { img: "/images/instagram.webp", icon: "/images/insta-gallary.png", value: "insta-link" }, {
  img: "/images/youtubetwo.webp", icon: "/images/youtube-gallary.png", value: "facebook"
},]
const gallaryMob = [{ img: "/images/shorts.webp", icon: "/images/shorts-gallary.png", value: "shorts" }, {
  img: "/images/youtubetwo.webp", icon: "/images/youtube-gallary.png", value: "youtube-video-2"
}, {
  img: "/images/youtubetwo.webp", icon: "/images/fb-logo.webp", value: "facebook"
}, { img: "/images/youtubeone.png", icon: "/images/youtube-gallary.png", value: "youtube-video-1" }, { img: "/images/tiktok.webp", icon: "/images/tiktok-gallary.png", value: "tiktok" }, { img: "/images/instagram.webp", icon: "/images/insta-gallary.png", value: "insta-link" },]


const getStyles = (val) => {
  return gallaryMob.find(ele => ele.value == val)
}

const getSpecialLink = (url) => {
  window.open(url, '_blank')
}
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
