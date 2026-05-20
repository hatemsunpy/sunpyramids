<template>
  <div class="bg-white rounded-3xl p-6">
    <div class="flex justify-between items-center mb-5">
      <div class="flex gap-3">
        <img class="w-16 h-16 object-cover rounded-2xl" :src="props.tour.car_image" loading="lazy" width="64" height="64" :alt="props.tour.car_type || 'Car thumbnail'" />

        <div>
          <h6 class="text-xk font-medium">{{ props.tour.car_type }}</h6>
        </div>
      </div>
    </div>

    <div class="col-span-2 grid grid-cols-2 gap-y-8 mb-4">
      <div class="col-span-1 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-1">
          {{ $t("labels.travelDate") }}
        </p>

        <p class="font-medium">
          {{ formatDate(props.tour.pickup_date, "date") }}
          {{ props.tour.pickup_time }}
        </p>
      </div>

      <div class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("labels.picUpLocation") }}
        </p>

        <p class="font-medium">
          {{ props.tour.pickup.name }}
        </p>
      </div>

      <div class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("labels.dropOffLocation") }}
        </p>

        <p class="font-medium">
          {{ props.tour.destination.name }}
        </p>
      </div>

      <div class="col-span-1 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-1">
          {{ $t('inputLabels.adults') + ' (12+)' }}
        </p>

        <p class="font-medium">
          {{ props.tour.adults }} </p>
      </div>

      <div class="col-span-1 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-1">
          {{ $t('inputLabels.children') + ' (3 - 11)' }}
        </p>

        <p class="font-medium">
          {{ props.tour.children }}
        </p>
      </div>

      <div class="col-span-1 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-1">
          {{ $t('inputLabels.infants') + ' (0 - 2)' }}
        </p>

        <p class="font-medium">
          {{ props.tour.adults }}
        </p>
      </div>
    </div>


    <div class="col-span-2 h-[2px] bg-[#F9FAFB] mb-5"></div>

    <div class="flex justify-between items-center">
      <div v-if="props.tour.car_route_price && props.tour.car_route_price.length != 0">
        <p class="text-sm text-[#666666] mb-1">{{ $t('labels.totalPrice') }}</p>

        <p class="text-[2rem] font-bold">{{ selectedCurrancies.symbol }}{{ (props.tour.car_route_price *
          selectedCurrancies.exchange_rate).toFixed(2) }}</p>
      </div>

      <div class="flex gap-4 items-end">
        <UIButton :loading="deleteBtnLoading" @click="deleteItem" preIcon="trash" type="button" :classes="[
          'py-3 !px-6 font-medium border !min-w-fit me-2  gap-2  !text-[#F55157]   font-meduim hover:text-white bg-[#f9e7e8]',
        ]" :preIconClasses="['!text-[#F55157] text-xl w-5 h-5']" :text="$t('labels.delete')" />
      </div>
    </div>
  </div>

</template>

<script setup lang='js'>
import { sharedStore } from '~/stores/sharedStore.js'
import { storeToRefs } from 'pinia'
const props = defineProps({
  tour: {
    type: Object,
    required: true
  }
})
const { selectedCurrancies } = storeToRefs(sharedStore())
const emits = defineEmits(["updateCart", "updateTotal"])



function formatDate(input, type) {
  if (type === "date") {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  } else if (type === "time") {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }) + " at " + date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).toLowerCase();
  } else if (type === "month") {
    const { month, year } = input;
    const date = new Date(year, month - 1); // month is zero-based in JavaScript Date
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  } else {
    return "Invalid type. Use 'date', 'time', or 'month'.";
  }
}
watch(() => props.tour, (newVal) => {
  emits('updateTotal', { subTotal: newVal.car_route_price ?? 0, addons: 0, total: newVal.car_route_price ?? 0 })
}, {
  immediate: true
})

const { deleteData } = useApi()
const toast = useNuxtApp().$toast
const deleteBtnLoading = ref(false)
const deleteItem = async () => {
  deleteBtnLoading.value = true
  await deleteData(`cart/remove/${props.tour.id}`).then((res) => {
    if (res.status) {
      deleteBtnLoading.value = false
      toast.success(res.message)
      emits('updateCart')
    }
  })
}
</script>

<style scoped lang='scss'></style>