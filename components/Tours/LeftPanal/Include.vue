<template>
  <div class="my-12">
    <ToursSharedHeader :expand="false" :title="$t('labels.tours.include')">
      <div v-if="tour && tour.included" class="mt-2 flex flex-col gap-[0.8125rem]">

        <div v-for="item in tour.included.split(',')" class="flex gap-2 items-center">
          <span
            class="border-[1.5px] border-primary min-w-[22px] max-w-[22px] h-[22px] text-[10px] flex items-center justify-center rounded-lg">
            <NuxtIcon name="correct-only" class="text-primary" />
          </span>

          <p class="text-[#666666]">{{ item }}</p>
        </div>
      </div>
    </ToursSharedHeader>
  </div>
</template>

<script setup lang='js'>
const isShowModel = ref(false)
const time = ref(Date.now())

const props = defineProps({
  tour: {
    type: Object
  }
})

const tour = ref(null)
watch(() => props.tour, (newVal) => {
  if (newVal) tour.value = newVal
}, {
  deep: true,
  immediate: true
})
</script>

<style scoped lang='scss'></style>