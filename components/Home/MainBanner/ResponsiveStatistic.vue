<template>
  <section class="w-full grid grid-cols-4 md:gap-5 gap-2 justify-between items-center px-4 my-10 mt-[240px]">
  <!-- <section class="w-full grid grid-cols-4 md:gap-5 gap-2 justify-between items-center px-4 my-10 mt-[117px]"> -->
    <div v-for="item in data" :key="item.name"
      class="overflow-hidden rounded-3xl h-full    hover:border-none transition-all duration-300 p-[1px]">
      <div
        class="flex flex-col h-full items-center justify-between gap-2 md:py-6 py-3 px-2 bg-[#fafafa] border-[#A5A5A5]/30   border-[1px] transition-all rounded-3xl ">
        <p
          class="text-textDark md:text-4xl text-[28px] font-bold group-hover:text-secondary transition-all  duration-200">
          {{ item.value }}</p>

        <p
          class="text-textLight md:text-base text-[10px] text-center font-medium group-hover:text-textDark transition-all  duration-200">
          {{
          item.name }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="js">
const data = [{ name: "Happy customer", value: "+100K" }, { name: "Years of experience", value: "+50" }, { name: "Total Destinations", value: "+60" }, { name: "Rating in Tripadvisor", value: "5.0" },]
</script>

<style scoped lang="scss"></style>