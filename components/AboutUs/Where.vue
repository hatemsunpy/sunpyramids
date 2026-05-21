<template>
  <section class="xl:px-20 px-4 pt-12 pb-16 text-center bg-primary">
    <h3 class="xl:text-5xl text-3xl w-[65%] mx-auto text-white font-bold">
      {{ $t("labels.aboutus.where.partOne") }}
      <span class="text-secondary">{{
        $t("labels.aboutus.where.partOneColered")
        }}</span>
      {{ $t("labels.aboutus.where.from") }}
      ?
    </h3>

    <h6 class="xl:text-xl text-base  text-[#A6BCF2] xl:mt-5 mt-2 mb-12"> {{ $t("labels.aboutus.where.overall") }}
    </h6>

    <NuxtImg src="/images/map.webp" class="w-full" />
  </section>
</template>

<script setup lang="js"></script>

<style scoped lang="scss"></style>
