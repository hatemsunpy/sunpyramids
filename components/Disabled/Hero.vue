<template>
  <section class="">
    <div class="md:h-[35vh] h-[45vh] relative flex ">
      <img :src="props.img" class="absolute start-0 w-full h-full object-cover lg:block hidden " />
      <img :src="props.imgPhone ?? props.img"
        class="absolute start-0 w-full h-full object-cover lg:hidden block brightness-[70%]" />

      <div
        class="text-center font-bold text-white top-10 xl:px-48 px-4 h-full flex items-center justify-center  w-full flex-col !z-10">
        <h1 class="2xl:text-6xl lg:text-[2.125rem] text-2xl   2xl:leading-[4.0625rem] leading-[2.5rem] secondText ">
          {{ props.title }}
        </h1>
        <h4 class="lg:text-[1.25rem] text-[15px] lg:mt-5 mt-2  secondText"> {{
          props.description }} </h4>
      </div>
    </div>
  </section>
</template>

<script setup lang="js">
const props = defineProps({
  img: {
    type: String,
    required: true
  },
  imgPhone: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  }
})

const router = useRouter()
const localePath = useLocalePath()

const goToWhatsApp = () => {
  window.open('https://api.whatsapp.com/send?phone=201095888830', '_blank')
}
</script>

<style scoped lang="scss"></style>

<style lang="scss">
.secondText {
  text-shadow: 0px 4px 40px rgba(0, 0, 0, 0.8), 0px 4px 24px rgba(0, 0, 0, 1);
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
