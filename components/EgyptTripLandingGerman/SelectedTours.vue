<template>
  <section class="lg:mt-14 mt-4">
    <div class="text-start lg:text-center md:w-full lg:mb-12 mb-4 px-4">
      <div class="flex lg:justify-center justify-between lg:items-center items-start">
        <div class="mx-auto">
          <div class="flex justify-center w-full items-center gap-2">
            <!-- <NuxtIcon name="discount" class="text-[#F7951D] lg:block hidden lg:text-5xl md:text-3xl text-xl " /> -->

            <h3 class="lg:text-5xl md:text-3xl text-xl text-center font-bold">
              {{ $t("labels.egypt-trip-landing-german.tours-subtitle") }}
            </h3>
          </div>

          <!-- <h6 class="lg:text-xl md:text-base text-xs text-textLight mt-2">
            {{ $t("labels.SpecialOfferForYouDesc") }}
          </h6> -->
        </div>

        <!-- <div @click="router.push(localePath('/trips?main=special-offers'))"
          class=" min-w-fit lg:hidden text-base text-primary md:text-lg flex  items-center gap-1  font-medium cursor-pointer">
          <p>{{ $t('labels.seeMore') }}</p>

          <NuxtImg src="/images/line-arrow-right.svg" class="w-4" />
        </div> -->
      </div>
    </div>

    <div class="w-full xl:px-20 mb-10">
      <div v-if="data.length">
        <div class="lg:grid hidden w-full  2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-5 gap-y-8">
          <SharedTourCard v-for="tour in data" :item="tour" :key="tour" />
        </div>

        <div class="block lg:hidden">
          <swiper :modules="modules" :autoplay="{
            delay: 3000,
            disableOnInteraction: false,
          }" :breakpoints="{
            '30': {
              slidesPerView: 1.25,
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
            <swiper-slide class="w-[15rem] group cursor-pointer h-[15rem] rounded-2xl overflow-hidden"
              v-for="tour in data" :item="tour" :key="tour">
              <SharedTourCard :item="tour" />
            </swiper-slide>

            <div class="w-full mt-6 h-[2px] bg-[#EEEEEE]"></div>
          </swiper>
        </div>
      </div>


      <UILoadingData v-else />

      <!-- <div class="mt-8 lg:block hidden">
        <SharedSeeMore path="/trips" />
      </div> -->
    </div>
  </section>
</template>

<script setup lang="js">
import { Swiper } from "swiper/vue";
import { Autoplay, FreeMode } from 'swiper/modules';
import "swiper/css";
let modules = [Autoplay, FreeMode];
const { getData } = useApi()
const data = ref([])

const url = `tours?page=1&page_limit=4&order_by=display_order,asc&categories.id%5B%5D=62`
data.value = await getData(url).then((res) => {
  return res.data.data
})
</script>

<style scoped lang="scss"></style>
