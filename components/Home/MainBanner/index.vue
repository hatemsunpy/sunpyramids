<template>
  <section class="h-[65vh] lg:h-[100vh] md:pt-[77px] sm:pt-[280px] pt-[200px]">
    <div class="h-[60vh] lg:h-[90vh] relative">
      <swiper v-if="homeData?.gallery?.length" :modules="modules"
        class="mainBannerSwiper z-10" :pagination="{ clickable: false }" :autoplay="{
          delay: 3000,
          disableOnInteraction: false,
        }">
        <swiper-slide v-for="(item, index) in homeData.gallery" :key="item">
          <img width="1920" height="1080" class="w-full h-full object-cover brightness-[85%]" :src="item"
            :alt="'main-banner-images-' + index" :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'auto'" />
        </swiper-slide>

        <div class="absolute top-0 start-0 xl lg:mt-[10rem] mt-[14rem] h-full w-full flex flex-col  gap-24 z-10">
        <!-- <div class="absolute top-0 start-0 xl lg:mt-[10rem] mt-[6.5rem] h-full w-full flex flex-col  gap-24 z-10"> -->
          <div class="text-center  font-bold text-white xl:px-48 lg:px-16 px-4">
            <!-- <h3
              class="2xl:text-5xl xl:text-3xl text-[28.88px] xl:mb-10 2xl:leading-[4.0625rem] leading-[3.5rem] secondText">
              class="2xl:text-5xl xl:text-3xl text-[28.88px] xl:mb-10 2xl:leading-[4.0625rem]  secondText">
              {{ $t("labels.criTitle") }}
            </h3> -->
            <h3
              class="2xl:text-5xl xl:text-3xl text-[28.88px] xl:mb-10 2xl:leading-[4.0625rem] leading-[3.5rem] secondText">
              {{ $t("labels.getStarted") }}
            </h3>

            <!-- <div v-if="timer"
              class="2xl:8xl xl:text-6xl lg:text-5xl text-3xl mainText 2xl:leading-[8.5rem] xl:leading-[7rem] leading-[3rem] flex justify-center">
              <div v-for="(item, index) in timeValues" :key="index"
                class="col-span-2 py-1 lg:w-32 w-24 px-2 text-center">
                <p class="lg:text-xl text-sm font-normal mb-2 text-white/80 text-center w-full">
                  {{ $t(`labels.time.${item.title}`).toLocaleUpperCase() }}
                </p>

                <p
                  class="2xl:text-7xl text-5xl lg:text-4xl font-medium text-center relative flex justify-center  items-center ">
                  {{ timer[item.value]
                  }}
                  <p class="text-5xl translate-x-2 text-center" v-if="index != 3">:</p>
                </p>
              </div>

            </div> -->

            <h1
              class="2xl:8xl xl:text-6xl lg:text-5xl text-3xl mainText 2xl:leading-[8.5rem] xl:leading-[7rem] leading-[3rem]">
              {{ $t("labels.excitingJourney") }}
            </h1>
          </div>

          <HomeMainBannerShortcuts />
        </div>
        <!-- <SharedIceFalling /> -->

      </swiper>



      <HomeMainBannerStatistics />

      <HomeMainBannerResponsiveShourcuts />
    </div>
  </section>

  <section class="block lg:hidden">
    <HomeMainBannerResponsiveStatistic />
  </section>
</template>

<script setup lang="js">
import { Pagination, Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';

const props = defineProps({
  data: {
    type: Array,
    default: []
  }
})

const { getData } = useApi()
const { addSeo } = useSeo()
const homeData = ref([])
await getData('pages/home?includes=seo', {}, true, ['gallery', 'seo']).then((res) => {
  homeData.value = res.data
})
addSeo(homeData.value)

// Preload LCP hero image so the browser starts loading before CSS blocks it
const img = useImage()
const heroSrc = computed(() => {
  const firstImage = homeData.value?.gallery?.[0]
  if (!firstImage) return null
  return img(firstImage, { width: 1536, quality: 80 })
})

useHead(() => {
  const src = heroSrc.value
  if (!src) return {}
  return {
    link: [
      { rel: 'preload', as: 'image', href: src, fetchpriority: 'high' }
    ]
  }
})

let modules = [Pagination, Autoplay];

const timer = ref(null)
const timeValues = [{ title: "day", value: "days" }, { title: "hour", value: "hours" }, { title: "minute", value: "minutes" }, { title: "second", value: "seconds" }]

function calculateDuration(dateString) {
  const targetDate = new Date(dateString).getTime();
  const now = Date.now();
  const diff = Math.abs(targetDate - now);

  const days = Math.floor(diff / (3600 * 24 * 1000));
  const hours = Math.floor((diff % (3600 * 24 * 1000)) / (3600 * 1000));
  const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  timer.value = {
    days: days < 10 ? '0' + days : days.toString(),
    hours: hours < 10 ? '0' + hours : hours.toString(),
    minutes: minutes < 10 ? '0' + minutes : minutes.toString(),
    seconds: seconds < 10 ? '0' + seconds : seconds.toString(),
  };
}
onMounted(() => {
  setInterval(() => {
    calculateDuration("2025-12-25T00:00:00.000000Z")
  }, 1000);
})

</script>

<style scoped lang="scss">
.mainText {
  text-shadow: 0px 4px 40px rgba(0, 0, 0, 0.4), 0px 2px 4px rgba(0, 0, 0, 0.4);
}

.secondText {
  text-shadow: 0px 4px 40px rgba(0, 0, 0, 0.4), 0px 4px 24px rgba(0, 0, 0, 0.4);
}
</style>
<style lang="scss">
.mainBannerSwiper {
  @apply w-full h-full relative;

  .swiper-pagination-fraction,
  .swiper-pagination-custom,
  .swiper-horizontal>.swiper-pagination-bullets,
  .swiper-pagination-bullets.swiper-pagination-horizontal {
    @apply sm:bottom-[7.125rem] bottom-16;
  }

  .swiper-pagination {
    @apply bottom-96;
  }

  .swiper-pagination-bullet {
    @apply bg-white w-[11px] h-[11px] rounded-full opacity-100;
  }

  .swiper-pagination-bullet-active {
    @apply bg-secondary;
  }
}
</style>
