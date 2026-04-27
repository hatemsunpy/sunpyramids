<template>
  <div class="w-full">
    <h1 class="text-[#666666] text-xl font-medium mb-4">{{ $t('labels.myBookings') }}</h1>

    <div class="w-full grid grid-cols-1 gap-6  rounded-3xl" v-if="Bookings.length > 0 && !isLoading">
      <template v-for="book in Bookings">
        <div class="flex flex-col gap-6">
          <MyBookingsCart :tour="book" />

          <!-- <CartStepsCartRentCard v-if="item.tour == 'rental'" :tour="tour" /> -->
        </div>
      </template>
    </div>

    <div v-if="!isLoading && Bookings.length == 0" class=" w-full h-96 rounded-3xl flex items-center justify-center">
      <p class=" text-2xl font-medium">There Are No Bookings :(
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
const Bookings = ref([])
Bookings.value = await getData('bookings?page_limit=200&includes=currency,tours', true).then((res) => {
  return res.data.data
})
isLoading.value = false
</script>

<style scoped lang='scss'></style>