<template>
  <section class="xl:px-20 px-4 py-[4.5rem] flex flex-col xl:flex-row items-center xl:gap-12 gap-6 justify-between">
    <div>
      <h3 class="xl:text-5xl text-3xl w-[60%] font-bold mb-7 xl:leading-[65.74px] leading-[100%]">
        <span class="text-secondary">{{
          $t("labels.aboutus.certfication.travelife")
        }}</span>
        {{ $t("labels.aboutus.certfication.line") }}
      </h3>

      <div class="flex gap-3 ">
        <div class="min-w-1 rounded-2xl min-h-full bg-primary"></div>
        <p class="text-xl text-[#444444] leading-8" v-html="data?.meta_value">
        </p>
        <!-- {{ $t(`labels.aboutus.certfication.info`) }} -->
      </div>
    </div>

    <div
      class="overflow- mx-4 xl:mx-0 xl:h-[30rem] xl:min-w-[39.375rem] h-[300px] md:h-[500px] w-full rounded-[2.375rem]">
      <NuxtImg class="w-full  h-full" src="/images/certified.webp" loading="lazy" />
    </div>
  </section>
</template>

<script setup lang="js">
const information = ["aboutOne", "aboutTwo", "aboutThree"]

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({})
  }
})
</script>

<style scoped lang="scss"></style>
