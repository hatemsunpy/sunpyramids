<template>
  <div class="border border-[#eeeeee] rounded-2xl overflow-hidden mb-4">
    <div class="px-4 py-2 bg-[#eeeeee] flex justify-between items-center cursor-pointer "
      :class="[isOpen ? '' : 'hover:text-primary hover:bg-[#e9eefc] transition-colors']" @click="isOpen = !isOpen">
      <h6 v-if="props.attraction && props.attraction.title" class=" font-medium">
        {{ props.attraction.title }} Attractions
      </h6>

      <NuxtIcon name="arrow-down" class="text-xl w-5 h-5 transition-all" :class="[isOpen ? 'rotate-180 ' : '']" />
    </div>

    <div v-if="isOpen" class="pt-4 ps-10 pb-6 text-[#666666]">
      <ul>
        <li v-for="child in props.attraction.children" class="list-disc mb-1">

          {{ child.title }}
        </li>
      </ul>

    </div>
  </div>
</template>

<script setup lang="js">
const isOpen = ref(true)

const props = defineProps({
  time: {
    type: Number
  },
  attraction: {
    type: Object
  },
  isClosedAll: {
    type: Boolean,
  }
})

watch(() => props.isClosedAll, (newVal) => {
  isOpen.value = newVal
})
</script>

<style scoped lang="scss"></style>