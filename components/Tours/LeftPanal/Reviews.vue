<template>
  <section class=" py-16 bg-white">
    <div class=" px-20">
      <h4 class="text-[2.125rem] font-bold">
        {{ $t("labels.tours.reviews") }}
      </h4>
    </div>

    <swiper :modules="modules" class="reviewsToursSwiper !px-20" :pagination="{ clickable: false }" :autoplay="{
      delay: 3000,
      disableOnInteraction: false,
    }" :breakpoints="{
      '30': {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      '768': {
        slidesPerView: 4.5,
        spaceBetween: 40,
      },
      '1024': {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    }" :freeMode="true">
      <swiper-slide class="w-[15rem] group cursor-pointer h-[15rem] rounded-2xl overflow-hidden" v-for="offer in 12"
        :key="offer">
        <div class="bg-[#f9fafb] p-6 rounded-3xl flex flex-col gap-4">
          <div class="flex justify-between items-center"><img src="../../../assets/icons/mark.png" alt="">

            <div class="flex gap-3">
              <p class="text-[#666666]">5.0</p>

              <div class="flex gap-1 items-center">

                <img v-for="item in 5" src="../../../assets/icons/star.png" alt="">
              </div>
            </div>
          </div>

          <p class="text-[#666666]">We hired Sun pyramids Tours for with my family when we visited Cairo. We were
            assigned Mr. Okasha as our
            coordinator and contact personMr. Okasha ....<span class="text-primary font-bold">read more</span> </p>

          <div class="flex justify-between mb-8">
            <div class="flex items-center gap-2">
              <NuxtImg src="/images/team/Mahmoud_badia.png" class="w-16 h-16 rounded-full" />
              <div>
                <h6 class="text-xl leading-8 font-medium">Mahmoud Badia</h6>

                <p class="text-[#666666]">Executive Manager</p>
              </div>
            </div>

            <NuxtImg src="/images/team/doupleQuote.png" class="w-20 h-[3.375rem]" />
          </div>
        </div>
      </swiper-slide>

      <div class="w-full mt-6 h-[2px] bg-[#EEEEEE]"></div>
    </swiper>

  </section>
</template>

<script setup lang="js">
import { Swiper } from "swiper/vue";
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';
let modules = [Pagination, Autoplay, FreeMode];
</script>

<style scoped lang="scss"></style>

<style lang="scss">
.absoluteTextShadow {
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.25);
}

.reviewsToursSwiper {
  @apply w-full h-full relative mt-12;

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
