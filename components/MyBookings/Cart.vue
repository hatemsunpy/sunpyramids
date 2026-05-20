<template>
  <div class="bg-white rounded-3xl p-6">
    <template class="w-full" v-for="(tour, index) in props.tour?.tours">
      <div class="w-full">

        <div class="flex justify-between lg:items-center items-start mb-5">
          <div class="flex gap-3">
            <img class="w-16 h-16 object-cover rounded-2xl" :src="tour.featured_image ?? tour.gallary[0]" loading="lazy" width="64" height="64" />

            <div>
              <h6 class="text-xk font-medium">{{ tour.title }}</h6>
            </div>
          </div>

          <div>
            <UIButton :text="$t(`labels.checkout.view`)" :classes="[
              'border border-textDark lg:flex hidden border-[1px] hover:bg-textDark text-textDark font-meduim hover:text-white gap-2 !py-2 !px-4',
            ]" preIcon="eye" :preIconClasses="[
              'text-xl  tranistion duration-300 !text-textDark !opacity-100 group-hover:!text-white w-5 h-5',
            ]" @click="router.push(localePath(`/tour/${tour.slug}`))" />
            <UIButton :classes="[
              'border border-textDark !flex lg:!hidden border-[1px] hover:bg-textDark text-textDark font-meduim hover:text-white !gap-0 !py-0 !px-0 !w-8 !h-8 !justify-center !items-center',
            ]" preIcon="eye" :preIconClasses="[
              'text-xl  tranistion duration-300 !text-textDark !opacity-100 group-hover:!text-white w-5 h-5',
            ]" @click="router.push(localePath(`/tour/${tour.slug}`))" />
          </div>
        </div>

        <div class="col-span-2 grid grid-cols-2 gap-y-8 mb-4">
          <div class="col-span-1 border-s-4 border-s-[#EEEEEE] ps-3">
            <p class="text-textLight mb-1">
              {{ $t("labels.travelDate") }}
            </p>

            <p class="font-medium">
              {{ formatDate(tour?.start_date, "date") }}
            </p>
          </div>

          <div class="col-span-1 border-s-4 border-s-[#EEEEEE] ps-3">
            <p class="text-textLight mb-1">
              {{ $t('inputLabels.adults') + ' (12+)' }}
            </p>

            <p class="font-medium">
              {{ tour?.adults }} </p>
          </div>

          <div class="col-span-1 border-s-4 border-s-[#EEEEEE] ps-3">
            <p class="text-textLight mb-1">
              {{ $t('inputLabels.children') + ' (3 - 11)' }}
            </p>

            <p class="font-medium">
              {{ tour.children }}
            </p>
          </div>

          <div class="col-span-1 border-s-4 border-s-[#EEEEEE] ps-3">
            <p class="text-textLight mb-1">
              {{ $t('inputLabels.infants') + ' (0 - 2)' }}
            </p>

            <p class="font-medium">
              {{ tour.infants }}
            </p>
          </div>
        </div>

        <div class="col-span-2 h-[2px] bg-[#F9FAFB] mb-4"></div>

        <div v-if="tour.options.length" class="mb-6">
          <div class="flex gap-2 ps-2 items-center">
            <p class="font-medium">{{ $t('labels.tours.addOns') }}</p>

            <div class="text-sm text-primary cursor-pointer flex gap-1 items-center"
              @click="isOpenAdds[index] = !isOpenAdds[index]">
              <p>{{ $t('labels.tours.seeDetails') }}</p>

              <NuxtIcon name="arrow-down" class="transition-all text-base"
                :class="[isOpenAdds[index] ? 'rotate-180' : ' rotate-0']" />
            </div>
          </div>

          <div v-show="isOpenAdds[index]">
            <div v-for="item in tour.options" :key="item.id"
              class="flex ps-8 items-center justify-between hover:bg-[#eeeeee] py-2 rounded-lg transition-colors">
              <div class="maincntr flex gap-2 items-center group w-fit">
                <input disabled checked v-model="addsValues[index]" :value="item.id" type="checkbox" name="catogries"
                  :id="item.id" class="hidden-xs-up maincbxInput !cursor-not-allowed" />
                <label :for="item.id"
                  class="maincbx !cursor-not-allowed group-hover:border-[#0d2359] checked: transition-colors"></label>

                <label :for="item.id" class="font-medium cursor-pointer group-hover:text-[#0d2359] transition-colors"
                  :class="[addsValues[index].includes(item.id) ? 'text-primary' : 'text-textDark']">
                  {{
                    item.name
                  }}</label>
              </div>
            </div>
          </div>
        </div>

        <div v-if="tour.options.length" class="col-span-2 h-[2px] bg-[#F9FAFB] mb-5"></div>

      </div>
    </template>
    <div class=" flex justify-between w-full items-center">
      <p class="text-2xl font-medium text-[#666666] mb-1">{{ $t('labels.totalPrice') }}</p>

      <p class="text-[2rem] font-bold">{{ props.tour.currency.symbol }}{{ (props.tour.total_price *
        props.tour.currency_exchange_rate).toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup lang='js'>
import { sharedStore } from '~/stores/sharedStore.js'
import { storeToRefs } from 'pinia'
const props = defineProps({
  tour: {
    type: Object,
    default: () => ({})
  }
})
const router = useRouter()
const localePath = useLocalePath()

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
const isSee = ref(false)

const addsValues = ref({})
const isOpenAdds = ref({})
watch(() => props.tour.tours, (newTours) => {
  if (newTours && newTours.length > 0) {
    newTours.forEach((tour, index) => {
      addsValues.value[index] = []
      isOpenAdds.value[index] = false
      tour.options.forEach((item) => {
        if (item.is_default) {
          addsValues.value[index].push(item.id)
        }
      })
    })
  }

}, { immediate: true })
</script>

<style scoped lang='scss'></style>