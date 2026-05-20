<template>
  <section class="xl:px-20 px-4 py-[4.5rem] flex flex-col-reverse xl:flex-row items-center gap-12 justify-between">
    <div
      class=" mx-4 xl:mx-0 xl:h-[30rem] xl:min-w-[39.375rem] h-[377px] md:h-[500px] w-full rounded-[2.375rem]">
      <img
        :src="props.img"
        class="rounded-[2.375rem] h-full w-full object-cover"
        alt="distination image" />
    </div>

    <div>
      <h3 class="xl:text-5xl text-3xl font-bold xl:mb-14 mb-6 leading-[65.74px]">
        <span class="text-secondary">{{
          $t("labels.aboutus.distination.distination")
        }}</span>
        {{ $t("labels.aboutus.distination.line") }}
      </h3>

      <div class="flex flex-col xl:gap-8 gap-4">
        <div v-for="(info, index) in props.data.meta_value?.split('.').slice(0, -1)" :key="index"
          class="flex gap-5 items-start">
          <span class="min-w-10 h-10 flex justify-center items-center bg-[#FEF3E6] rounded-2xl">
            <NuxtIcon name="send" class="text-2xl text-secondary" />
          </span>

          <p class="xl:text-xl text-[#444444] leading-8">
            {{ info }} .
          </p>
        </div>
      </div>
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
  img:{
    type: String,
    required: true,
    default: () => ''
  }
})
</script>

<style scoped lang="scss"></style>
