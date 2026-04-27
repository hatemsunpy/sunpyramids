<template>
  <section
    class="hidden  absolute bottom-0 start-0 z-20 w-full lg:grid grid-cols-4 gap-5 translate-y-1/2 justify-between items-center px-20 ">
    <div v-for="item in data" :key="item.name"
      class="overflow-hidden rounded-3xl  hover:shadow-md  group hover:border-none transition-all duration-300 p-[1px]">
      <div
        class="flex flex-col items-center gap-2 py-6 bg-[#fafafa] border-[#EEEEEE]  group-hover:bg-white group-hover:scale-105 group-hover:-translate-x-[4px] border-[1px] transition-all rounded-3xl  duration-300">
        <p class="text-textDark text-4xl font-bold group-hover:text-secondary transition-all  duration-200">
          {{ item.value }}</p>

        <p class="text-textLight text-base font-medium group-hover:text-textDark transition-all  duration-200">{{
          $t(`labels.${item.name}`) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="js">
const data = [{ name: "happyCustomer", value: "+100K" }, { name: "yearsExperience", value: "+50" }, { name: "totalDistination", value: "+60" }, { name: "ratingAdvisors", value: "5.0" },]
</script>

<style scoped lang="scss"></style>
