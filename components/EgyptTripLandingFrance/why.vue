<template>
  <section class="xl:py-20 py-12 2xl:px-20 xl:px-12 px-4 bg-white">
    <div class="flex lg:justify-center justify-between lg:items-center items-start">
      <div class="text-center w-full">
        <h3 class="lg:text-5xl md:text-3xl text-2xl font-bold">
          {{ $t("labels.whyChooseUs") }}
        </h3>
      </div>
    </div>

    <div class="lg:mt-12 mt-4 flex lg:flex-row flex-col  items-center justify-center gap-5">
      <template v-for="(step, index) in steps" :key="index">
        <div
          class="flex lg:flex-col flex-row gap-3 lg:gap-0 items-center jus py-8 xl:px-16 lg:px-10 px-4 w-full text-center border border-dark rounded-3xl">
          <NuxtIcon :name="step.icon" class="text-[4rem] lg:mb-5 text-primary" />

          <div class="lg:text-center text-start text-">
            <h4 class="font-bold lg:mt-4 xl:text-4xl text-2xl lg:mb-4">
              {{ $t(`labels.egypt-trip-landing-france.${step.title}.title`) }}
            </h4>

            <p class="text-[#666666] xl:text-base text-sm">
              {{ $t(`labels.egypt-trip-landing-france.${step.title}.desc`) }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="js">
const steps = [
  { title: "adventure", icon: "verified" },
  { title: "transfers", icon: "car-filled" },
  { title: "style", icon: "hotels" }
];
</script>