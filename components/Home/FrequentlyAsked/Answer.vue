<template>
  <div class="border border-[#f9fafb] rounded-2xl overflow-hidden">
    <div class="p-4 bg-[#F9FAFB] flex justify-between items-center cursor-pointer "
      :class="[isOpen ? '' : 'hover:text-primary hover:bg-[#e9eefc] transition-colors']" @click="isOpen = !isOpen">
      <h6 class="xl:text-xl md:text-base font-medium">
        {{ props.feq.question }}
      </h6>

      <NuxtIcon name="arrow-down" class="xl:text-[2rem] text-2xl xl:w-8 xl:h-8 w-6 h-6 transition-all"
        :class="[isOpen ? 'rotate-180 ' : '']" />
    </div>

    <p v-if="isOpen" class="pt-4 px-5 pb-6 text-[#666666]" v-html="props.feq?.answer"></p>
  </div>
</template>
<script setup lang="js">
const props = defineProps({
  feq: {
    type: String,
    default: {}
  }
})
const isOpen = ref(false)
</script>

<style scoped lang="scss"></style>
