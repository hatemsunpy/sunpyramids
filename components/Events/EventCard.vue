<template>
  <NuxtLink :class="props.class" class="" :to="localePath(`/event/${props.data?.slug}`)">
    <div class="cursor-pointer hover:-translate-y-2 transition-all duration-300 relative overflow-hidden rounded-2xl
    group egyptTourCard col-span-1">
      <div class="egyptTourCardSwiper relative categoryBox">
        <div class="bg-no-repeat object-center bg-cover bg-center h-full w-full backgroundhover cursor-pointer"
          v-for="offer in 1" :key="offer">

          <img :src="props.data?.featured_image" class="w-full h-full object-cover" loading="lazy" width="600" height="400" style="aspect-ratio: 3 / 2;" decoding="async" />
          <!-- <NuxtImg src="/images/IMG_3817.jpg" class="w-full h-full object-cover" /> -->
        </div>

        <h4
          class="text-white !textH4   2xl:text-[26px] sm:text-2xl cursor-pointer text-xl absolute w-[90%]  bottom-20  transition-all z-20 font-medium sm:start-5 xl-start-11 start-[10px]">
          {{ props.data?.title }} </h4>

        <NuxtLink :to="localePath(`/event/${props.data?.slug}`)">
          <button
            class="px-6 lg:!py-3 !py-[6px] !p !w-fit  bg-primary flex !rounded-full !gap-2 !justify-center absolute bottom-[14px] z-20 sm:start-5 xl-start-11 start-[10px]   border-primary border-[1px] lg:text-base text-sm font-medium hover:bg-[#143485] text-white font-meduim hover:text-white">
            {{ $t('labels.readMore') }}
          </button>
        </NuxtLink>

        <!-- <UIButton @click="router.push(localePath(`/event/${props.data?.slug}`))" type="button" :classes="[
          'lg:!py-3 !py-[6px] !p !w-fit  gap-2 border bg-primary flex !rounded-full !gap-2 !justify-center absolute bottom-16 z-20 sm:start-5 xl-start-11 start-[10px]   border-primary border-[1px] lg:text-base text-sm font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
        ]" :text="$t('labels.readMore')" /> -->

        <div class="absolute bottom-0 start-0 w-full h-[70%]  z-10 categoryBox"></div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="js">
import { Swiper } from "swiper/vue";
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Autoplay } from 'swiper/modules';
let modules = [Pagination, Autoplay];

const router = useRouter()
const localePath = useLocalePath()

const props = defineProps({
  path: {
    type: String,
    required: false,
  }, data: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
  class: {
    type: String,
    required: false,
  },
})
</script>

<style scoped lang="scss">
.textH4 {
  text-shadow: 0px 2px 4px rgb(0, 0, 0, 0.25);
}

.categoryBox {
  div {
    background: linear-gradient(to top,
        #00000099 0%,
        #00000000 40%,
        #00000000 100%);
  }
}
</style>

<style lang="scss">
.egyptTourCardSwiper {
  @apply h-[20.75rem] !w-full relative rounded-2xl;

  .swiper-pagination-fraction,
  .swiper-pagination-custom,
  .swiper-horizontal>.swiper-pagination-bullets,
  .swiper-pagination-bullets.swiper-pagination-horizontal {
    @apply bottom-0 opacity-0 group-hover:opacity-100 group-hover:bottom-2 transition-all duration-100;
  }

  .swiper-pagination {
    @apply bottom-96;
  }

  .swiper-pagination-bullet {
    @apply bg-white w-[8px] h-[8px] rounded-full opacity-100;
  }

  .swiper-pagination-bullet-active {
    @apply bg-secondary;
  }
}

.backgroundhover {
  background-size: 25.75rem;
  webkit-transition: background-size 100ms linear;
  -moz-transition: background-size 100 linear;
  -o-transition: background-size 100 linear;
  -ms-transition: background-size 100ms linear;
  transition: background-size 100ms linear;
}

.egyptTourCard:hover .backgroundhover {
  background-size: 29.6125rem;
}
</style>
