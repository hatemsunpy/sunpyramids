<template>
  <section class=" xl:px-20 px-4 pb-[4.5rem] flex flex-col xl:flex-row items-center gap-12 justify-between">
    <div>
      <h3 class="xl:text-5xl text-3xl font-bold xl:mb-14 mb-6 leading-[65.74px]">
        {{ $t("labels.aboutus.sunpyramids.about") }}
        <span class="text-secondary">{{
          $t("labels.aboutus.sunpyramids.sunpyramids")
        }}</span>
        {{ $t("labels.aboutus.sunpyramids.tours") }}
      </h3>

      <div class="flex flex-col xl:gap-8 gap-4">
        <div v-for="(info, index) in props.data.meta_value?.split('.').slice(0, -1)" :key="index"
          class="flex gap-5 items-start">
          <span class="min-w-10 h-10 flex justify-center items-center bg-[#FEF3E6] rounded-2xl">
            <NuxtIcon name="triangle" class="text-2xl text-secondary" />
          </span>

          <!-- <p class="text-xl text-[#444444] leading-8">{{ $t(`labels.aboutus.sunpyramids.${info}`) }}</p> -->
          <p class="xl:text-xl text-[#444444] leading-8">{{ info }} .</p>
        </div>
      </div>
    </div>

    <div class="b mx-4 xl:mx-0 xl:h-[30rem] xl:min-w-[39.375rem] h-[377px] md:h-[500px] w-full rounded-[2.375rem]">
      <NuxtImg :src="props.img" class="rounded-[2.375rem] h-full w-full object-cover" alt="distination image" />
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

<style scoped lang="scss"></style>
