<template>
  <section class="mt-4 px-4 xl:my-16 my-6">
    <div class="flex lg:justify-center justify-between lg:items-center items-start">
      <div class="text-start lg:text-center md:w-full">
        <h3 class="lg:text-5xl md:text-3xl text-xl font-bold">
          {{ $t("labels.gallaryHome") }}
        </h3>

        <h6 class="lg:text-xl md:text-base text-xs text-textLight mt-2">
          {{ $t("labels.gallaryHomeDesc") }}
        </h6>
      </div>
      <!-- 
      <div
        class=" min-w-fit lg:hidden text-base text-primary md:text-lg flex  items-center gap-1  font-medium cursor-pointer">
        <p>{{ $t('labels.seeMore') }}</p>

        <NuxtImg src="/images/line-arrow-right.svg" class="w-4" />
      </div> -->
    </div>

    <div v-if="settings && settings.length != 0" class="w-full xl:px-20 xl:mt-10 mt-4">
      <div class="lg:grid hidden  grid-rows-2 grid-cols-4 gap-x-5 gap-2">
        <div v-for="item in gallary" class="grid-flow-col relative rounded-2xl overflow-hidden"
          :class="[item.value.includes('youtube-video') ? 'row-span-1' : ' row-span-2']">
          <NuxtLink :to="getLinkOnly(item.value)" target="_blank">
            <img :src="item?.img" class="w-full h-full" loading="lazy" alt="" />
          </NuxtLink>

          <img :src="item?.icon" @click="getLink(item.value)" alt="" role="button" aria-label="Open link"
            class="absolute w-[4.5rem] h-[4.5rem] rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
        </div>
      </div>

      <div class="block lg:hidden">
        <swiper :modules="modules" :autoplay="{
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
          <swiper-slide class=" group cursor-pointer !h-[20rem]  rounded-2xl overflow-hidden"
            v-for="item in gallaryMob">
            <div class="h-full">
              <img :src="item?.img" class="w-full !h-full object-cover" loading="lazy" alt="" />
              <img :src="item?.icon" @click="getLink(item.value)" alt="" role="button" aria-label="Open link"
                class="absolute w-[4.5rem] h-[4.5rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
            </div>
          </swiper-slide>

          <div class="w-full mt-6 h-[2px] bg-[#EEEEEE]"></div>
        </swiper>
      </div>
    </div>
  </section>
</template>

<script setup lang='js'>
import { sharedStore } from '~/stores/sharedStore.js'
import { storeToRefs } from 'pinia'
import { Swiper } from "swiper/vue";
import { Autoplay, FreeMode } from 'swiper/modules';
import "swiper/css";

let modules = [Autoplay, FreeMode];
const { settings } = storeToRefs(sharedStore())
const localePath = useLocalePath()



const getLinkOnly = (value) => {
  if (!settings.value) return '#';
  const setting = settings.value.find((s) => s.option_key == "social_links");
  if (!setting) return '#';
  const link = setting.option_value?.find((v) => v.type == value);
  return link?.url ?? '#';
}
const getLink = (value) => {
  if (!settings.value) return;
  const setting = settings.value.find((s) => s.option_key == "social_links");
  if (!setting) return;
  const link = setting.option_value?.find((v) => v.type == value);
  const url = link?.url;
  if (url) window.open(url, '_blank', 'width=650,height=800,scrollbars=yes,resizable=yes');
}

const gallary = [{ img: "/images/shorts.png", icon: "/images/shorts-gallary.png", value: "shorts" }, { img: "/images/youtubeone.png", icon: "/images/youtube-gallary.png", value: "youtube-video-1" }, { img: "/images/tiktok.png", icon: "/images/tiktok-gallary.png", value: "tiktok" }, { img: "/images/instagram.png", icon: "/images/insta-gallary.png", value: "insta-link" }, {
  img: "/images/youtubetwo.png", icon: "/images/fb-logo.webp", value: "youtube-video-2"
},]
const gallaryMob = [{ img: "/images/shorts.png", icon: "/images/shorts-gallary.png", value: "shorts" }, {
  img: "/images/youtubetwo.png", icon: "/images/youtube-gallary.png", value: "youtube-video-2"
}, { img: "/images/youtubeone.png", icon: "/images/fb-logo.webp", value: "youtube-video-2" }, { img: "/images/tiktok.png", icon: "/images/tiktok-gallary.png", value: "tiktok" }, { img: "/images/instagram.png", icon: "/images/insta-gallary.png", value: "insta-link" },]


</script>

<style scoped lang='scss'></style>