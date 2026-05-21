<template>
  <NuxtLink :to="localePath(`${props.path}/${props.data?.slug}`)">

    <div class="cursor-pointer relative overflow-hidden rounded-2xl
    group egyptTourCard col-span-1">
      <div :modules="modules" class="egyptTourCardSwiper relative categoryBox " :pagination="{ clickable: true }"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false,
        }">
        <div class="bg-no-repeat object-center bg-cover bg-center h-full w-full backgroundhover cursor-pointer"
          v-for="offer in 1" :key="offer">

          <img :src="props.data?.featured_image" class="w-full h-full object-cover" loading="lazy" width="600" height="400" style="aspect-ratio: 3 / 2;" decoding="async" />
        </div>

        <h4
          class="text-white !textH4   2xl:text-[26px] sm:text-2xl cursor-pointer text-xl absolute w-full  bottom-6 group-hover:bottom-10 transition-all z-20 font-medium"
          :class="[props.type == 'nile' ? '!start-1/2 text-center -translate-x-1/2' : 'sm:start-5 xl-start-11 start-[10px]']">
          {{ props.data?.title }}
        </h4>

        <h6 v-if="props.type == 'nile'"
          class="text-white text-center  !textH4 2xl:text-xl cursor-pointer text-base absolute w-full -translate-x-1/2  bottom-0 group-hover:bottom-4 transition-all z-20 font-medium"
          :class="[props.type == 'nile' ? '!left-1/2 -translate-x-1/2' : 'sm:start-5 xl-start-11  start-[10px]']"
          v-html="props.data?.description">
        </h6>

        <div class="absolute bottom-0 start-0 w-full h-[70%]  z-10 categoryBox"></div>
        <!-- <h4
        class="text-white !textH4 text-4xl absolute start-11 bottom-8 group-hover:bottom-12 transition-all z-10 font-medium"
        :class="[props.type == 'nile' ? '!text-center' : '']">
        {{ props.data?.title }}
      </h4> -->

      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="js">
import { Swiper } from "swiper/vue";
import { Pagination, Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';
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
  }
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

  // &:hover>div {
  //   @apply transition-all;
  //   background: linear-gradient(to top,
  //       #000000cc 0%,
  //       #00000000 70%,
  //       #00000000 100%);
  // }
}
</style>

<style lang="scss">
.egyptTourCardSwiper {
  @apply sm:h-[25.75rem] h-[14rem] sm:w-[25.75rem] relative rounded-2xl;

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
