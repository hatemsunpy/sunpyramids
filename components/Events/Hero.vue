<template>
  <section class="">
    <div class="h-[60vh] relative flex">
      <NuxtImg :src="props.img" class="absolute start-0 w-full h-full object-cover lg:block hidden" />
      <NuxtImg :src="props.imgPhone ?? props.img" class="absolute start-0 w-full h-full object-cover lg:hidden block" />

      <!-- <NuxtImg src="/images/IMG_3817.jpg" class="absolute start-0 w-full h-full" /> -->
      <div
        class="text-center font-bold text-white top-10 xl:px-48 h-full flex items-center justify-center  w-full flex-col !z-10">
        <h1 class="2xl:text-5xl lg:text-[2rem] text-2xl   2xl:leading-[4.0625rem] leading-[2.5rem] secondText ">
          {{ props.title }}
          <!-- {{ $t("labels.book-egy-trip.title") }} -->
        </h1>
        <!-- <h4 class="lg:text-[1.25rem] text-[15px] lg:mt-5 mt-2  secondText"> {{ $t("labels.book-egy-trip.desc") }} </h4> -->

        <!-- <div class="flex md:flex-row flex-col md:w-fit w-full lg:gap-8 gap-2 justify-center mt-10 px-16">
          <UIButton type="button" @click="goToWhatsApp" :classes="[
            'lg:!py-3 !py-[6px] !px-0 gap-2 border !rounded-md bg-[#1FAF38] flex !gap-2 !justify-center cur  !min-w-full border-[#1FAF38] border-[1px] lg:text-base text-sm font-medium hover:bg-[#60D669]  text-white font-meduim hover:text-white',
          ]" preIcon="whatsapp" :preIconClasses="['lg:text-2xl text-lg text-white mb-0 w-6 h-6']"
            :text="$t('labels.whatsapp')" />

          <UIButton @click="router.push(localePath('/make-your-trip'))" type="button" :classes="[
            'lg:!py-3 !py-[6px] !px-0  gap-2 border bg-primary flex !rounded-md !gap-2 !justify-center  !min-w-full border-primary border-[1px] lg:text-base text-sm font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
          ]" preIcon="plane" :preIconClasses="['lg:text-2xl text-lg !text-white mb-0 w-6 h-6']"
            :text="$t('labels.planYourTrip')" />
        </div> -->
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
    required: true
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
