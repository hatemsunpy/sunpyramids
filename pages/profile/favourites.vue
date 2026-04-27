<template>
  <div class="w-full">
    <h1 class="text-[#666666] text-xl font-medium mb-4">{{ $t('labels.myFavorites') }}</h1>

    <div class="w-full grid 2xl:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-4 px-5 py-6 rounded-3xl bg-white"
      v-if="!isLoading && tours.length > 0">
      <SharedTourCard v-for="tour in tours" :item="tour" :key="tour" :showTimer="false" />
    </div>

    <div v-if="!isLoading && tours.length == 0" class=" w-full h-96 rounded-3xl flex items-center justify-center">
      <p class=" text-2xl font-medium">The Wishlist Isempty :(
      </p>
    </div>

    <div v-if="isLoading" class="bg-white w-full h-96 rounded-3xl flex items-center justify-center">
      <UILoadingData />
    </div>
  </div>

  <SharedBottomBar />
</template>

<script setup lang='js'>
const { getData } = useApi()

const isLoading = ref(true)
const tours = ref([])
tours.value = await getData('wishlist?page=1&page_limit=200', true).then((res) => {
  return res.data.data
})
isLoading.value = false
</script>

<style scoped lang='scss'></style>