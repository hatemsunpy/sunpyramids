<template>
  <section class="">
    <div class="h-[75vh] relative -z-10 2xl:-mt-[11rem] flex items-end -mt-[16rem]">
      <div class="mainSwiper !h-3/4" >
        <div class="bg-no-repeat bg-cover bg-center" v-for="offer in 1" :key="offer">
          <NuxtImg :src="props.img" class="w-full h-full object-cover lg:block hidden" />
          <NuxtImg :src="props.imgPhone ?? props.img" class="!w-full !min-h-[65vh] object-cover lg:hidden block" />
        </div>
        <div
          class="text-center font-bold text-white xl:px-48 h-full flex items-center justify-center absolute top-0 start-0 w-full flex-col z-10">
          <h4 v-if="props.subTitle" class="text-[2.125rem] 2xl:mt-[14rem] mt-[6rem] secondText">{{
            $t(`labels.${props.subTitle}`) }}</h4>
          <h1 class="2xl:text-5xl text-[2.5rem]  mb-10 2xl:leading-[4.0625rem] leading-[3.5rem] secondText "
            :class="[!props.subTitle ? '2xl:mt-[14rem] mt-[6rem] ' : '']">
            {{ props.directTitle ? props.title : $t(`labels.${props.title}`) }}
          </h1>
        </div>

        <div class="absolute top-0 start-0 mt-[10rem] h-full w-full flex flex-col gap-24 z-10"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="js">

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  directTitle: {
    type: Boolean,
    required: false
  },
  subTitle: {
    type: String,
    required: false
  },
  img: {
    type: String,
    required: true
  },
  imgPhone: {
    type: String,
    required: false
  }
})
</script>

<style scoped lang="scss"></style>

<style lang="scss">
.secondText {
  text-shadow: 0px 4px 40px rgba(0, 0, 0, 0.4), 0px 4px 24px rgba(0, 0, 0, 0.4);
}

.mainSwiper {
  @apply w-full h-full relative;

  .swiper-pagination-fraction,
  .swiper-pagination-custom,
  .swiper-horizontal>.swiper-pagination-bullets,
  .swiper-pagination-bullets.swiper-pagination-horizontal {
    @apply bottom-8;
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
