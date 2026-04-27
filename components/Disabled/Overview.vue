<template>
  <section class="  2xl:px-20 px-4 py-14 bg-white flex flex-col xl:flex-row items-center gap-12 justify-between">
    <div class="!min-w-[60%]">
      <h3 class="xl:text-5xl text-3xl font-bold xl:mb-10 lg:mb-6 mb-2 lg:leading-[65.74px] leading-10">
        <!-- {{ $t("labels.aboutus.sunpyramids.about") }}
        <span class="text-secondary">{{
          $t("labels.aboutus.sunpyramids.sunpyramids")
        }}</span>
        {{ $t("labels.aboutus.sunpyramids.tours") }} -->

        {{ $t('labels.specialNeed.we') }} <span class="text-secondary">{{ $t('labels.specialNeed.care') }}</span> - {{
          $t('labels.specialNeed.special') }} <span class="text-secondary">{{ $t('labels.specialNeed.announcement')
          }}</span>
      </h3>

      <div class="flex flex-col justify-start xl:gap-4 gap-3">
        <!-- <div
         v-for="(info, index) in props.data.meta_value?.split('.').slice(0, -1)" :key="index"
          class="flex gap-5 items-start"> -->
        <div class="flex gap-5 items-start">
          <!-- <p class="text-xl text-[#444444] leading-8">{{ $t(`labels.aboutus.sunpyramids.${info}`) }}</p> -->
          <p class="xl:text-xl text-[#444444] md:leading-8 font-medium"> {{ $t('labels.specialNeed.first') }}
          </p>
        </div>

        <div class="flex flex-col gap-3 items-start">
          <!-- <span class="min-w-10 h-10 flex justify-center items-center bg-[#FEF3E6] rounded-2xl">
            <NuxtIcon name="triangle" class="text-2xl text-secondary" />
          </span> -->

          <!-- <p class="text-xl text-[#444444] leading-8">{{ $t(`labels.aboutus.sunpyramids.${info}`) }}</p> -->
          <p class="xl:text-xl text-[#444444] md:-8 font-bold">
            {{ $t('labels.specialNeed.five.title') }}
          </p>

          <ul class="ms-2 -mt-1 font-medium  md:text-lg">
            <li class=""> {{ $t('labels.specialNeed.five.paragraph') }}
            </li>
          </ul>
        </div>

        <div class="flex flex-col gap-3 items-start">
          <!-- <span class="min-w-10 h-10 flex justify-center items-center bg-[#FEF3E6] rounded-2xl">
            <NuxtIcon name="triangle" class="text-2xl text-secondary" />
          </span> -->

          <!-- <p class="text-xl text-[#444444] leading-8">{{ $t(`labels.aboutus.sunpyramids.${info}`) }}</p> -->
          <p class="xl:text-xl text-[#444444] md:-8 font-bold">
            {{ $t('labels.specialNeed.second.title') }}
          </p>

          <ul class="md:ms-6 ms-4  font-medium md:text-lg">
            <li class="list-disc"> {{ $t('labels.specialNeed.second.one') }}
            </li>
            <li class="list-disc"> {{ $t('labels.specialNeed.second.two') }}
            </li>
            <li class="list-disc"> {{ $t('labels.specialNeed.second.three') }}</li>
          </ul>
        </div>
        <div>
          <!-- <p class="text-xl text-[#444444] leading-8">{{ $t(`labels.aboutus.sunpyramids.${info}`) }}</p> -->
          <p class="xl:text-xl text-[#444444] md:leading-8 font-medium"> {{ $t('labels.specialNeed.third') }}
          </p>
        </div>
        <div>
          <!-- <p class="text-xl text-[#444444] leading-8">{{ $t(`labels.aboutus.sunpyramids.${info}`) }}</p> -->
          <p class="xl:text-xl text-[#444444] md:leading-8 font-medium"> {{ $t('labels.specialNeed.sixth') }}
          </p>
        </div>
        <div>
          <!-- <p class="text-xl text-[#444444] md:leading-8">{{ $t(`labels.aboutus.sunpyramids.${info}`) }}</p> -->
          <p class="xl:text-xl text-[#444444] md:leading-8 font-bold">
            {{ $t('labels.specialNeed.fourth') }}
          </p>
        </div>



        <!-- <div>
          <UIButton @click="" :classes="[
            'py-4 px-[3.5rem] md:col-span-2 col-span-1 !justify-center min-w-fit bg-secondary text-white font-medium hover:bg-[#c57007] h-full',
          ]" text="Get Started" type="button" />
        </div> -->
      </div>
    </div>

    <div class="overflow- !w-3/4 blob-wrapper  mx-4 xl:mx-0 flex items-start justify-center  rounded-[2.375rem]">
      <img class="w-full object-cover object-top  h-full" src="~/assets/imgs/wheelChair.png" />
    </div>
  </section>
</template>

<script setup lang="js">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({})
  },
  img: {
    type: String,
    required: true,
    default: () => ''
  }
})
</script>

<style scoped lang="scss">
.blob-wrapper {
  width: 300px;
  height: 480px;
  overflow: hidden;

  border-radius: 57% 44% 55% 45% / 42% 58% 42% 58%;
}
</style>
