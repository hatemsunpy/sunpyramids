<template>
  <div class="my-12">
    <ToursSharedHeader :expand="false" :title="$t('labels.tours.exclude')">
      <div v-if="tour && tour.excluded" class="mt-2 flex flex-col gap-[0.8125rem]">

        <div v-for="item in tour.excluded.split(',')" class="flex gap-2 items-center">
          <span
            class="border-[1.5px] border-secondary min-w-[22px] max-w-[22px] h-[22px] text-[10px] flex items-center justify-center rounded-lg">
            <NuxtIcon name="add" class="text-secondary rotate-45 text-xl" />
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