<template>
  <section class="xl:mt-14 mt-6 xl:py-16 py-10 2xl:px-20 xl:px-12 px-4">
    <div class="flex lg:justify-center justify-between lg:items-center items-start">
      <div class="text-start lg:text-center md:w-full">
        <h3 class="lg:text-5xl md:text-3xl text-xl font-bold">
          {{ $t("labels.howItWorks") }}
        </h3>

        <h6 class="lg:text-xl md:text-base text-xs text-textLight mt-2">
          {{ $t("labels.howItWorksDesc") }}
        </h6>
      </div>


      <!-- <div
        class=" min-w-fit lg:hidden text-base text-primary md:text-lg flex  items-center gap-1  font-medium cursor-pointer">
        <p>{{ $t('labels.seeMore') }}</p>

        <NuxtImg src="/images/line-arrow-right.svg" class="w-4" />
      </div> -->
    </div>

    <div class="mt-12 flex lg:flex-row flex-col  items-center justify-center gap-5">
      <template v-for="(step, index) in steps" :key="index">
        <div
          class="flex lg:flex-col flex-row gap-3 lg:gap-0 items-center py-6 xl:px-16 lg:px-10 px-4 w-full text-center border border-dark rounded-3xl">
          <div
            class="flex mb-1 xl:text-[5.9375rem] text-5xl overflow-visible items-center justify-center xl:w-16  xl:h-16 w-8 h-8 rounded-full text-primary font-bold bg-[#eeeeee]">
            {{ index + 1 }}
          </div>

          <div class="lg:text-center text-start">
            <h4 class="font-bold lg:mt-4 xl:text-4xl text-2xl lg:mb-4">
              {{ $t(`labels.bookingSteps.${step}.title`) }}
            </h4>

            <p class="text-[#666666] xl:text-base text-sm">
              {{ $t(`labels.bookingSteps.${step}.desc`) }}
            </p>
          </div>
        </div>

        <NuxtImg v-if="index + 1 != steps.length" src="/images/arrow_steps.png" class="lg:w-24 w-12  lg:block hidden" />
      </template>
    </div>
  </section>
</template>

<script setup lang="js">
const steps = ["find", "booking", "enjoy"];
</script>