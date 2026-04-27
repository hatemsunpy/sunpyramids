<template>
  <section class="text-center xl:px-20 px-4 py-[4.5rem] bg-[#f9fafb]">
    <h3 class="xl:text-5xl text-3xl font-bold mb-14 xl:leading-[65.74px] leading-[100%]">
      {{ $t("labels.aboutus.partnership.partnership") }}
      <span class="text-secondary">{{
        $t("labels.aboutus.partnership.benefits")
        }}</span>
      {{ $t("labels.aboutus.partnership.line") }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-8 gap-2 justify-between">
      <div v-for="(item, index) in benefits" :key="index" class="py-8 px-12 max-w-full bg-[#FFFFFF] rounded-[3rem]">
        <span class="w-[5.5rem] h-[5.5rem] flex justify-center mx-auto mb-7 items-center bg-[#E9EEFC] rounded-[2rem]">
          <NuxtIcon :name="item.icon" class="w-10 h-10 text-[2.5rem] text-primary" />
        </span>

        <h6 class="text-xl font-medium text-[#444444] leading-8">{{ $t(`labels.aboutus.partnership.${item.title}`) }}
        </h6>
      </div>
    </div>
  </section>
</template>

<script setup lang="js">
const benefits = [{title:"one" , icon:"verify"},{title:"two" , icon:"task"},{title:"three" , icon:"squares"},]
</script>

<style scoped lang="scss"></style>
