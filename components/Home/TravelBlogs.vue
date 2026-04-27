<template>
  <section class="xl:py-16 py-6 xl:px-20 px-4">
    <div class=" flex lg:justify-center justify-between lg:items-center items-start">
      <h3 class="lg:text-5xl md:text-3xl text-xl font-bold text-center xl:mb-14 mb-6">
        {{ $t("labels.travelBlogs") }}
      </h3>

      <div @click="router.push(localePath('/blogs/all-blogs'))"
        class=" min-w-fit lg:hidden text-base text-primary md:text-lg flex  items-center gap-1  font-medium cursor-pointer">
        <p>{{ $t('labels.seeMore') }}</p>

        <NuxtImg src="/images/line-arrow-right.svg" class="w-4" />
      </div>
    </div>

    <div class="w-full mb-10">
      <div v-if="travelsBlogs.length" class="mb-8">
        <div class="lg:grid hidden w-full  2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-x-5 gap-y-8">
          <SharedBlogCard v-for="blog in travelsBlogs" :key="blog?.id" :blog="blog" />
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
            <swiper-slide class="w-[15rem] group cursor-pointer h-[15rem] rounded-2xl overflow-hidden"
              v-for="blog in travelsBlogs" :key="blog?.id">
              <SharedBlogCard :blog="blog" />
            </swiper-slide>

            <div class="w-full mt-6 h-[2px] bg-[#EEEEEE]"></div>
          </swiper>
        </div>
      </div>



      <UILoadingData v-else />

      <div class="mt-8 lg:block hidden">
        <SharedSeeMore path="/blogs/all-blogs" />
      </div>
    </div>
  </section>
</template>

<script setup lang="js">
const { getData } = useApi()
const travelsBlogs = ref([])

travelsBlogs.value = await getData("blogs/home?page_limit=8&order_by=id,desc").then((res) => {
  return res.data.data
})

const router = useRouter()
const localePath = useLocalePath()
</script>

<style scoped lang="scss"></style>
