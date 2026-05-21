<template>
  <section class=" flex flex-col xl:flex-row items-center gap-12 justify-between">
    <div class="!min-w-[60%]">
      <h3 class="xl:text-5xl text-3xl font-bold xl:mb-14 lg:mb-6 mb-2 lg:leading-[65.74px] leading-10">
        <!-- {{ $t("labels.aboutus.sunpyramids.about") }}
        <span class="text-secondary">{{
          $t("labels.aboutus.sunpyramids.sunpyramids")
        }}</span>
        {{ $t("labels.aboutus.sunpyramids.tours") }} -->

        Tailored <span class="text-secondary">guidance</span> for your <span
          class="text-secondary">sustainability</span> journey
      </h3>

      <div class="flex flex-col justify-start xl:gap-8 gap-2">
        <!-- <div
         v-for="(info, index) in props.data.meta_value?.split('.').slice(0, -1)" :key="index"
          class="flex gap-5 items-start"> -->
          <div class="flex gap-5 items-start">
          <!-- <span class="min-w-10 h-10 flex justify-center items-center bg-[#FEF3E6] rounded-2xl">
            <NuxtIcon name="triangle" class="text-2xl text-secondary" />
          </span> -->

          <!-- <p class="text-xl text-[#444444] leading-8">{{ $t(`labels.aboutus.sunpyramids.${info}`) }}</p> -->
          <p class="xl:text-2xl text-[#444444] leading-8 font-medium">Sustainability is not an add-on — it is integrated
            into how we design, operate, and deliver travel experiences across Egypt.
          </p>
        </div>
        
        <div class="flex gap-5 items-start">
          <!-- <span class="min-w-10 h-10 flex justify-center items-center bg-[#FEF3E6] rounded-2xl">
            <NuxtIcon name="triangle" class="text-2xl text-secondary" />
          </span> -->

          <!-- <p class="text-xl text-[#444444] leading-8">{{ $t(`labels.aboutus.sunpyramids.${info}`) }}</p> -->
          <p class="xl:text-2xl text-[#444444] leading-8 font-medium">Answer questions about sustainability at your
            property and
            we’ll use your answers—along with your property type and location—to offer you tailored ideas for the next
            steps in your sustainability journey.</p>
        </div>



        <!-- <div>
          <UIButton @click="" :classes="[
            'py-4 px-[3.5rem] md:col-span-2 col-span-1 !justify-center min-w-fit bg-secondary text-white font-medium hover:bg-[#c57007] h-full',
          ]" text="Get Started" type="button" />
        </div> -->
      </div>
    </div>

    <div
      class="overflow- mx-4 xl:mx-0 flex items-center justify-center  rounded-[2.375rem]">
      <NuxtImg class="w-3/4  h-full" src="/images/certified-logo.webp" loading="lazy" />
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
