<template>
  <div class="flex items-center justify-center gap-4">
    <div class="w-full border-[2px] relative">
      <div class="w-3 h-3 rounded-full absolute -start-3 top-1/2 -translate-y-1/2 bg-[#DEDEDE]"></div>
    </div>

    <UIButton postIcon="arrow-down" :loading="props.isLoading" :postIconClasses="['w-5 h-5 text-xl font-normal']"
      @click="props.path ? router.push(localePath(props.path)) : emits('seeMore')" :classes="[
        'text-white min-w-fit font-medium bg-secondary hover:bg-[#c57007] py-[11px] px-6 gap-2',
      ]" :text="$t('labels.seeMore')" />

    <div class="w-full border-[2px] relative">
      <div class="w-3 h-3 rounded-full absolute -end-3 top-1/2 -translate-y-1/2 bg-[#DEDEDE]"></div>
    </div>
  </div>
</template>

<script setup lang="js">
const props = defineProps({
  path: {
    type: String,
    required: true
  },
  isLoading: {
    type: Boolean,
  }
});
const emits = defineEmits(['seeMore'])


const router = useRouter();
const localePath = useLocalePath()
</script>

<style scoped lang="scss"></style>
