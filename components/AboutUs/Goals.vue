<template>
  <section class="xl:px-20 px-4 py-[4.5rem] flex flex-col xl:flex-row items-start gap-8 justify-between">
    <div v-for="(item, index) in goals" :key="index"
      class="border-2 w-full !h-full flex flex-col  gap-6 border-[#EEEEEE] xl:p-8 p-6 rounded-[2rem]">
      <span
        class="flex justify-center items-center xl:rounded-[2rem] rounded-2xl text-secondary xl:w-[5.5rem] xl:h-[5.5rem] w-[4.5rem] h-[4.5rem] bg-[#FEF3E6]">
        <NuxtImg :src="item.icon" class="xl:w-10 xl:h-10 w-8 h-8  object-cover" alt="" />
      </span>

      <h4 class="xl:text-[2.125rem] text-2xl font-medium">
        {{ $t(`labels.aboutus.goals.${item.name}.title`) }}
      </h4>

      <p class="text-[#444444] text-start xl:text-xl"
        v-html="props.data.find((meta) => meta.meta_key == item.name)?.meta_value?.replace('\n', '<br/>')">
      </p>
      <!-- {{ $t(`labels.aboutus.goals.${item.name}.paragraph`) }} -->
    </div>
  </section>
</template>

<script setup lang="js">
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => ([])
  }
})
const goals = [{ name: "mission", icon: "/images/airdrop.png" }, { name: "vision", icon: "/images/eye.png" }]
</script>

<style scoped lang="scss"></style>
