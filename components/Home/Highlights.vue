<template>
  <section class="xl:mt-14 xl:py-16 py-10">
    <div class="flex lg:justify-center  justify-between lg:items-center items-start xl:px-20 px-4">
      <div class="text-start lg:text-center md:w-full relative">
        <h3 class="lg:text-5xl md:text-3xl text-xl font-bold">
          {{ $t("labels.highlightsOfEgypt") }}
        </h3>

        <h6 class="lg:text-xl md:text-base text-xs text-textLight mt-2">
          {{ $t("labels.highlightsOfEgyptDesc") }}
        </h6>

      </div>

      <!-- <div
        class=" min-w-fit lg:hidden text-base text-primary md:text-lg flex  items-center gap-1  font-medium cursor-pointer">
        <p>{{ $t('labels.seeMore') }}</p>

        <NuxtImg src="/images/line-arrow-right.svg" class="w-4" />
      </div> -->
    </div>

    <swiper v-if="data.length" :modules="modules" class="highlightsSwiper !xl:px-20 !px-4"
      :pagination="{ clickable: true }" @swiper="setSwiperInstance" :autoplay="isAnyCardHovered ? false : {
        delay: 3000,
        disableOnInteraction: false,
      }" :breakpoints="{
        '30': {
          slidesPerView: 2.5,
          spaceBetween: 8,
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

      <swiper-slide @mouseenter="handleSlideHover(true)" @mouseleave="handleSlideHover(false)"
        class="xl:w-[15rem] group cursor-pointer xl:h-[15rem] !h-[20rem] rounded-2xl overflow-hidden relative categoryBox"
        v-for="item in data" :key="item?.id">
        <NuxtLink :to="localePath(`/egypt-tours/one-day-tours/${item.slug}`)">
          <NuxtImg class="w-full group-hover:scale-125 transition-all h-full object-cover bg-cover"
            :src="item?.featured_image" loading="lazy" sizes="xs:40vw sm:40vw md:40vw lg:33vw xl:15rem"
            width="400" height="400" style="aspect-ratio: 1 / 1;" />

          <p class="absolute absoluteTextShadow bottom-[0.875rem] start-[0.875rem] z-10 text-xl font-bold text-white">{{
            item?.title }}
          </p>

          <div class="absolute bottom-0 start-0 w-full h-[70%] categoryBox"></div>
        </NuxtLink>
      </swiper-slide>
    </swiper>

    <UILoadingData v-else />

  </section>
</template>

<script setup lang="js">
import { Swiper } from "swiper/vue";
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';
let modules = [Pagination, Autoplay, FreeMode];
const { getData } = useApi()
const swiperInstance = ref(null);
const isAnyCardHovered = ref(false);
const localePath = useLocalePath()

const setSwiperInstance = (swiper) => {
  swiperInstance.value = swiper;
};

const handleSlideHover = (isHovered) => {
  if (swiperInstance.value) {
    if (isHovered) {
      swiperInstance.value.autoplay.stop();
    } else {
      swiperInstance.value.autoplay.start();
    }
  }
}
const data = ref([])

data.value = await getData("destinations/home?page_limit=200&parent.slug=egypt&order_by=display_order,asc").then((res) => {
  return res.data.data
})
</script>

<style scoped lang="scss">
.categoryBox {
  div {
    background: linear-gradient(to top,
        #00000099 0%,
        #00000000 40%,
        #00000000 100%);
  }

  &:hover>div {
    @apply transition-all;
    background: linear-gradient(to top,
        #000000cc 0%,
        #00000000 70%,
        #00000000 100%);
  }
}
</style>

<style lang="scss">
.absoluteTextShadow {
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.25);
}

.highlightsSwiper {
  @apply w-full h-full relative mt-12;

  .swiper-pagination-fraction,
  .swiper-pagination-custom,
  .swiper-horizontal>.swiper-pagination-bullets,
  .swiper-pagination-bullets.swiper-pagination-horizontal {
    @apply bottom-0;
  }

  .swiper-pagination {
    @apply flex justify-center mt-8 relative;
  }

  .swiper-pagination-bullet {
    @apply bg-[#DEDEDE] w-[11px] h-[11px] rounded-full opacity-100;
  }

  .swiper-pagination-bullet-active {
    @apply bg-secondary;
  }
}
</style>
