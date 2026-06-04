<template>
  <section class="lg:mt-[9.3125rem] mt-[4.5rem] px">
    <div class="px-4 flex lg:justify-center justify-between lg:items-center items-start">
      <div class="text-start lg:text-center md:w-full">
        <h3 class="lg:text-5xl md:text-3xl text-xl font-bold">
          {{ $t("labels.popularDistnation") }}
        </h3>

        <h6 class="lg:text-xl md:text-base text-xs text-textLight mt-2">
          {{ $t("labels.popularDistnationDesc") }}
        </h6>
      </div>

      <div @click="router.push(localePath(selectedFilter.path))"
        class=" min-w-fit lg:hidden text-base text-primary md:text-lg flex  items-center gap-1  font-medium cursor-pointer">
        <p>{{ $t('labels.seeMore') }}</p>

        <NuxtImg src="/images/line-arrow-right.svg" class="w-4" />
      </div>
    </div>

    <div class="scroll-container px-4">
      <div class="flex justify-center my-8 gap-3 flex-nowrap    bg-third w-fit mx-auto p-1 rounded-full">
        <UIButton v-for="item in filters" :text="$t(`labels.popular.${item.title}`)" :classes="[
          'font-medium md:text-base text-sm min-w-fit !py-[6] md:py-2',
          selectedFilter.filter === item.filter
            ? 'border border-primary border-[1px] bg-primary text-white'
            : 'text-textDark hover:bg-dark',
        ]" :key="item.filter" @click="selectedFilter = item" />
      </div>
    </div>


    <div class="w-full xl:px-20 mb-10">
      <div v-if="data.length">
        <div class="lg:grid hidden w-full  2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-5 gap-y-8">
          <SharedTourCard v-for="tour in data" :item="tour" :key="tour" :showTimer="false" />
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
            <swiper-slide class=" group cursor-pointer rounded-2xl overflow-hidden !min-h-full" v-for="tour in data"
              :item="tour" :key="tour">
              <SharedTourCard :item="tour" :showTimer="false" />
            </swiper-slide>

            <div class="w-full mt-6 h-[2px] bg-[#EEEEEE]"></div>
          </swiper>
        </div>
      </div>


      <UILoadingData v-else />

      <div class="mt-8 lg:block hidden">
        <SharedSeeMore :path="selectedFilter.path" />
      </div>
    </div>
  </section>
</template>

<script setup lang="js">
import { Swiper } from "swiper/vue";
import 'swiper/css'
import 'swiper/css/free-mode'
import { Autoplay, FreeMode } from 'swiper/modules';
let modules = [Autoplay, FreeMode];
const router = useRouter()
const localePath = useLocalePath()
const filters = [{
  title: "recomanded", filter: "all", url: "tours/home?page=1&order_by=display_order,asc&page_limit=8", path: "/trips"
}, { title: "oneDay", filter: "oneDay", url: "tours/home?page=1&page_limit=8&order_by=display_order,asc&categories.slug%5B%5D=night-tours&categories.slug%5B%5D=one-day-tours&categories.slug%5B%5D=half-day-tour&categories.slug%5B%5D=layover", path: "/egypt-tours/one-day-tours" }, {
  title: "multiDays", filter: "multiDays", url: "tours/home?page_limit=8&page=1&order_by=display_order,asc&categories.id%5B%5D=all&categories.id%5B%5D=48&categories.id%5B%5D=39&categories.id%5B%5D=38&categories.id%5B%5D=12&categories.id%5B%5D=11&categories.id%5B%5D=10&categories.id%5B%5D=9&categories.id%5B%5D=8&categories.id%5B%5D=7&categories.id%5B%5D=6&categories.id%5B%5D=5&categories.id%5B%5D=4&categories.id%5B%5D=3"
  , path: "/egypt-tours/multi-days-tours"
}, { title: "nileCruises", filter: "nileCruises", url: "tours/home?page_limit=8&page=1&order_by=display_order,asc&categories.id%5B%5D=null&categories.id%5B%5D=26&categories.id%5B%5D=27&categories.id%5B%5D=28", path: "/egypt-tours/nile-cruises" }, {
  title: "shoreExsurision", filter: "shoreExsurision", url: "tours/home?page_limit=8&page=1&order_by=display_order,asc&categories.id%5B%5D=all&categories.id%5B%5D=46&categories.id%5B%5D=45&categories.id%5B%5D=44&categories.id%5B%5D=43&categories.id%5B%5D=42&categories.id%5B%5D=23"
  , path: "/egypt-tours/shore-excursions"
},]
const selectedFilter = ref({
  title: "recomanded", filter: "all", url: "tours/home?featured=1&page=1&order_by=display_order,asc&page_limit=8", path: "/trips"
})

const { getData } = useApi()
const data = ref([])


data.value = await getData(selectedFilter.value.url).then((res) => {
  return res.data.data
})
const getPopularTours = async (item) => {
  data.value = []
  await getData(item.url).then((res) => {
    data.value = res.data.data
  })
}

watch(selectedFilter, (newVal) => {
  getPopularTours(newVal)
})
</script>

<style scoped lang="scss"></style>
