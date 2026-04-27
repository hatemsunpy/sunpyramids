<template>
  <section class="xl:px-20 px-4 py-[4.5rem] flex flex-col xl:flex-row items-center xl:gap-12 gap-6 justify-between bg-white">
    <div>
      <h3 class="xl:text-5xl text-3xl md:w-[60%] font-bold mb-7 xl:leading-[65.74px] leading-[100%]">
        <span class="text-secondary">{{
          $t("labels.aboutus.certfication.travelife")
        }}</span>
        {{ $t("labels.aboutus.certfication.line") }}
      </h3>

      <div class="flex gap-3 ">
        <div class="min-w-1 rounded-2xl min-h-full bg-primary"></div>
        <!-- <p class="text-xl text-[#444444] leading-8" v-html="data?.meta_value"> -->
        <p class="text-xl text-[#444444] leading-8" v-html="paragraph">
        </p>
        <!-- {{ $t(`labels.aboutus.certfication.info`) }} -->
      </div>
    </div>

    <div
      class="overflow- mx-4 xl:mx-0 xl:h-[30rem] xl:min-w-[39.375rem] h-[300px] md:h-[500px] w-full rounded-[2.375rem]">
      <NuxtImg class="w-full  h-full" src="/images/certified.png" loading="lazy" />
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

const paragraph = "We at Sun Pyramids Tours believe that by taking proactive steps to minimize our environmental footprint, we can contribute to a healthier planet for future generations.\r\n\r\nWe’re committed to sustainable travel and are proud to have achieved the travel life partner certificate, and aiming soon to achieve the travel life final certification, which means we meet international standards for responsible tourism.\r\nFrom reducing our environmental impact to supporting local communities, we’re dedicated to making a positive difference.\r\nWhen you choose us, you’re not just booking a trip, you’re supporting a greener, more ethical way to explore the world.\r\nJoin us on this journey toward a more sustainable future!\r\n\r\nExplore responsibly with us, check our Privacy, Sustainability, and Responsible Travel policies.\r\nWe proudly collaborate with a carefully selected group of hotels and resorts across Egypt that are certified for their commitment to sustainable and responsible tourism. Each property on this list meets international standards for environmental care, social responsibility, and quality service, ensuring you enjoy a stay that supports both comfort and conscious travel.\r\n\r\nSee the list <a href=\"https://docs.google.com/spreadsheets/d/1SdEIAqsA571x1HMrbVIUlSjiw2_S7OXY/edit?usp=sharing&ouid=100898331197827306244&rtpof=true&sd=true\" target=\"_blank\"><strong>here</strong></a>\r\n\r\n,and See the Sustainability Policy <a href=\"https://docs.google.com/document/d/1T5v8kwtWD__2CFd1q9zN-jmFmIwt6_Wk/edit?usp=sharing&ouid=103811166013034787069&rtpof=true&sd=true\" target=\"_blank\"><strong>here</strong></a><br>\r\n<strong>Contact email : </strong>sustainability@sunpyramidstours.com"
</script>

<style scoped lang="scss"></style>
