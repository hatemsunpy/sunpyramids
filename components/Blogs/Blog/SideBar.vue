<template>
  <div class="mb-3" v-if="props.item.title">
    <div
      class="flex gap-4 items-center p-2 rounded-xl hover:bg-[#eeeeee] transition-colors justify-between w-full cursor-pointer"
      :class="props.selectedChild == props.item.id ? 'text-primary bg-[#eeeeee]' : ''"
      @click="isOpen = !isOpen, props.item?.children?.length ? null : emit('updateRelation', props.item?.id)">
      <p class="truncate">{{ cleanTitle(props.item.title) }}</p>

      <NuxtIcon v-if="props.item?.children?.length" name="arrow-down" class="text-base w-4 h-4 transition-all"
        :class="[isOpen ? 'rotate-180 ' : 'rotate-0']" />
    </div>

    <div class="flex flex-col gap-1" v-if="isOpen">
      <p class="ms-6 p-2 py-1 hover:bg-[#eeeeee] hover:text-primary rounded-xl truncate cursor-pointer"
        v-for="child in props.item.children" :class="[child.id == selectedChildNew ? 'text-primary bg-[#eeeeee]' : '',]"
        @click="emit('updateRelation', child.id)">
        {{ cleanTitle(child.title) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="js">
const emit = defineEmits(["updateRelation"])
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  selectedChild: {
    type: Object,
    required: true
  }
})

const selectedChildNew = ref(null)
const isOpen = ref(false)


watch(() => props.selectedChild, (newVal) => {
  selectedChildNew.value = newVal
}, {
  immediate: true
})

function cleanTitle(title) {
  const entityMap = {
    '&nbsp;': ' ',
    '&rsquo;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'", // Single quote
    '&#34;': '"', // Double quote
    '&#160;': ' ', // Non-breaking space
  };

  return title
    .replace(/&[a-zA-Z0-9#]+;/g, (match) => entityMap[match] || match) // Replace known entities
    .replace(/[\s!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|-]+$/, '') // Remove trailing special characters
    .trim(); // Trim spaces
}
</script>

<style scoped lang="scss"></style>
