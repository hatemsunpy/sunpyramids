<template>
  <section class="p-4 pb-6 flex flex-col gap-4 border-b-2 border-b-[#EEEEEE]">
    <div class="flex  justify-between items-center">
      <h4 class="md:text-[2.125rem] text-2xl   font-medium" v-if="props.title">{{ props.title }}</h4>

      <div class="flex gap-4 items-center">
        <UIButton v-if="props.expand && !props.isClosedAll" @click="emits('expandAll')" :classes="[
          'border border-primary font-medium hover:text-white hover:bg-primary transition transition-all !duration-200',
        ]" :text="$t('labels.tours.expandAll')" />

        <UIButton v-if="props.expand && props.isClosedAll" @click="emits('expandAll')" :classes="[
          'border border-primary font-medium hover:text-white hover:bg-primary transition transition-all !duration-200',
        ]" :text="$t('labels.tours.contractAll')" />

        <button @click="isOpen = !isOpen" class="transition-all" :class="[isOpen ? 'rotate-180' : '']">
          <NuxtIcon name="arrow-down" class="text-2xl transition-all hover:text-primary" />
        </button>
      </div>
    </div>

    <div v-show="isOpen">
      <slot />
    </div>
  </section>
</template>

<script setup lang="js">
const emits = defineEmits(["expandAll"])
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  expand: {
    type: Boolean,
    default: true
  },
  isClosedAll: {
    type: Boolean,
    default: true
  }
})

const isOpen = ref(true)
</script>

<style scoped lang="scss"></style>
