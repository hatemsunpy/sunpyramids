<template>
  <div class="bg-white rounded-3xl p-6">
    <div class="flex justify-between lg:items-center items-start mb-5">
      <div class="flex gap-3">
        <NuxtImg class="w-16 h-16 object-cover rounded-2xl" :src="tour.tour.featured_image ?? tour.tour.gallary[0]" loading="lazy" sizes="64px" width="64" height="64" />

        <div>
          <h6 class="text-xk font-medium">{{ tour.tour.title }}</h6>

          <p class="text-textLight font-medium">{{ selectedCurrancies.symbol }}{{ (nativeCalculate).toFixed(2) }} / {{
            tour.tour.duration_in_days }} Day</p>
        </div>
      </div>

      <div>
        <UIButton :text="$t(`labels.checkout.view`)" :classes="[
          'border border-textDark lg:flex !hidden border-[1px] hover:bg-textDark text-textDark font-meduim hover:text-white gap-2 !py-2 !px-4',
        ]" preIcon="eye" :preIconClasses="[
          'text-xl  tranistion duration-300 !text-textDark !opacity-100 group-hover:!text-white w-5 h-5',
        ]" @click="router.push(localePath(`/tour/${props.tour.tour.slug}`))" />
        <UIButton :classes="[
          'border border-textDark !flex lg:!hidden border-[1px] hover:bg-textDark text-textDark font-meduim hover:text-white !gap-0 !py-0 !px-0 !w-8 !h-8 !justify-center !items-center',
        ]" preIcon="eye" :preIconClasses="[
          'text-xl  tranistion duration-300 !text-textDark !opacity-100 group-hover:!text-white w-5 h-5',
        ]" @click="router.push(localePath(`/tour/${props.tour.tour.slug}`))" />
      </div>
    </div>

    <div class="col-span-2 grid grid-cols-2 gap-y-8 mb-4">
      <div class="col-span-1 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-1">
          {{ $t("labels.travelDate") }}
        </p>

        <p class="font-medium">
          {{ formatDate(props.tour?.start_date, "date") }}
        </p>
      </div>

      <div class="col-span-1 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-1">
          {{ $t('inputLabels.adults') + ' (12+)' }}
        </p>

        <p class="font-medium">
          {{ props.tour?.adults }} </p>
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
          {{ props.tour.infants }}
        </p>
      </div>
    </div>

    <div class="col-span-2 h-[2px] bg-[#F9FAFB] mb-4"></div>

    <div v-if="tour.options.length" class="mb-6">
      <div class="flex gap-2 ps-2 items-center">
        <p class="font-medium">{{ $t('labels.tours.addOns') }}</p>

        <div class="text-sm text-primary cursor-pointer flex gap-1 items-center" @click="isSee = !isSee">
          <p>{{ $t('labels.tours.seeDetails') }}</p>

          <NuxtIcon name="arrow-down" class="transition-all text-base" :class="[isSee ? 'rotate-180' : ' rotate-0']" />
        </div>

        <p class="ms-auto text-xl font-medium">{{ selectedCurrancies.symbol }}{{ (totalOptionsPrice).toFixed(2) }}</p>
      </div>

      <div v-show="isSee">
        <div v-for="item in props.tour.options" :key="item.id"
          class="flex ps-8 items-center justify-between hover:bg-[#eeeeee] py-2 rounded-lg transition-colors">
          <div class="maincntr flex gap-2 items-center group w-fit">
            <input disabled checked v-model="addsValues" :value="item.id" type="checkbox" name="catogries" :id="item.id"
              class="hidden-xs-up maincbxInput !cursor-not-allowed" />
            <label :for="item.id"
              class="maincbx !cursor-not-allowed group-hover:border-[#0d2359] checked: transition-colors"></label>

            <label :for="item.id" class="font-medium cursor-pointer group-hover:text-[#0d2359] transition-colors"
              :class="[addsValues.includes(item.id) ? 'text-primary' : 'text-textDark']">
              {{
                item.name
              }}</label>
          </div>

          <p class="text-sm  font-medium" :class="[addsValues.includes(item.id) ? 'text-primary' : 'text-textDark']">
            {{ selectedCurrancies.symbol }}{{ (getOptionPriceById(item.id) *
              selectedCurrancies.exchange_rate).toFixed(2) }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="tour.options.length" class="col-span-2 h-[2px] bg-[#F9FAFB] mb-5"></div>

    <div class="flex md:flex-row flex-col md:gap-0 gap-6 justify-between items-center">
      <div class="md:block flex justify-between w-full items-center">
        <p class="text-sm text-[#666666] mb-1">{{ $t('labels.totalPrice') }}</p>

        <p class="text-[2rem] font-bold">{{ selectedCurrancies.symbol }}{{ (total).toFixed(2) }}</p>
      </div>

      <div class="flex w-full md:gap-4 gap-2 items-end">
        <UIButton :loading="deleteBtnLoading" @click="deleteItem" preIcon="trash" type="button" :classes="[
          'py-3 !px-6 font-medium border w-full !md:min-w-fit me-2 !justify-center  gap-2  !text-[#F55157]   font-meduim hover:text-white bg-[#f9e7e8]',
        ]" :preIconClasses="['!text-[#F55157] text-xl w-5 h-5']" :text="$t('labels.delete')" />

        <UIButton @click="getTourData" :loading="editBtnLoading" type="button" preIcon="edit-2"
          :preIconClasses="['!text-white !text-xl']" :classes="[
            '!py-3 !px-12 w-full min-w-fit gap-2 border bg-primary !justify-center  text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
          ]" :text="$t('labels.edit')" />
      </div>
    </div>
  </div>

  <CartStepsCartEdit :infants="props.tour.infants" :children="props.tour.children" :date="props.tour.start_date"
    :adults="props.tour.adults" v-if="tourEditData" @close="tourEditData = null" @updateData="emits('updateCart')"
    :tour="tourEditData" :selectedAdds="props.tour.options.map(opt => opt.id) ?? []" />
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
const emits = defineEmits(["updateCart", "updateTotal"])
const router = useRouter()
const localePath = useLocalePath()
const toast = useNuxtApp().$toast
const { getData } = useApi()

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

const addsValues = ref(props.tour.options.map((item) => item.id))

const { selectedCurrancies } = storeToRefs(sharedStore())

const pricingData = ref({
  adult_price: 0,
  child_price: 0,
  infant_price: 0,
  pricing_groups: [
  ]
})

const seasons = ref([])

const selectData = ref({
  adult: props.tour.adults,
  children: props.tour.children,
  infants: props.tour.infants,
  date: props.tour.start_date,
})

const tour = ref(null)
watch(() => props.tour, (newVal) => {
  pricingData.value.adult_price = newVal.tour.adult_price
  pricingData.value.child_price = newVal.tour.child_price
  pricingData.value.infant_price = newVal.tour.infant_price
  if (newVal.tour.pricing_groups) pricingData.value.pricing_groups = newVal.tour.pricing_groups
  if (newVal.tour.seasons) seasons.value = newVal.tour.seasons
  tour.value = newVal
}, {
  deep: true,
  immediate: true
})

const nativeCalculate = computed(() => {
  if (tour.value) {
    const { adult, children, infants, date } = selectData.value;
    let pricingSource = pricingData.value
    const getGroup = (groups) =>
      groups.find(g => adult >= g.from && adult <= g.to)

    // Helper: Check if date matches a season's availability
    const isDateInSeason = (season, dateObj) => {
      const availability = season.calender_availability
      const day = dateObj.getDate()
      const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
      const month = dateObj.toLocaleDateString('en-US', { month: 'long' }).toLowerCase()
      const year = dateObj.getFullYear()

      return (
        availability.day_numbers.includes(day) &&
        availability.day_names.includes(weekday) &&
        availability.month_names.includes(month) &&
        availability.years_numbers.includes(year)
      )
    }

    // If date exists, check against seasons
    if (date) {
      const dateObj = new Date(date)
      const matchedSeason = seasons.value.find(season => isDateInSeason(season, dateObj))

      if (matchedSeason) {
        pricingSource = matchedSeason
      }
    }

    const group = getGroup(pricingSource.pricing_groups ?? [])

    let adultCost, childCost

    if (group) {
      adultCost = group.price * adult
      childCost = group.child_price * children
    } else {
      adultCost = (pricingSource.adult_price ?? pricingData.value.adult_price) * adult
      childCost = (pricingSource.child_price ?? pricingData.value.child_price) * children
    }

    const infantCost = (pricingSource.infant_price ?? pricingData.value.infant_price) * infants

    return ((adultCost + childCost + infantCost) * selectedCurrancies.value.exchange_rate)
  } else {
    return 0
  }
})

const priceWithDiscount = computed(() => {
  return nativeCalculate.value - (nativeCalculate.value * (tour.value.tour?.offer / 100))
})

const totalOptionsPricebc = computed(() => {
  return addsValues.value.reduce((total, selectedId) => {
    const option = tour.value?.options.find(opt => opt.id === selectedId)
    if (!option) return total

    const adults = selectData.value.adult
    const children = selectData.value.children

    let adultTotal = 0
    let childTotal = 0

    // If pricing groups exist
    if (option.pricing_groups && option.pricing_groups.length > 0) {
      const totalPeople = adults + children

      // Find matching group
      const group = option.pricing_groups.find(g =>
        totalPeople >= g.from && totalPeople <= g.to
      )

      if (group) {
        adultTotal = group.price * adults
        childTotal = group.child_price * children
      } else {
        // fallback to base price
        adultTotal = option.adult_price * adults
        childTotal = option.child_price * children
      }
    } else {
      // No pricing group, just use basic pricing
      adultTotal = option.adult_price * adults
      childTotal = option.child_price * children
    }

    return total + adultTotal + childTotal
  }, 0)
})

const totalOptionsPrice = computed(() => {
  return selectedCurrancies.value.exchange_rate * (totalOptionsPricebc.value ?? 0)
})

const total = computed(() => {
  return totalOptionsPrice.value + priceWithDiscount.value
})

function getOptionPriceById(optionId) {
  const option = props.tour.options.find(opt => opt.id === optionId)
  if (!option) return 0

  const adults = selectData.value.adult
  const children = selectData.value.children
  const totalPeople = adults + children

  let adultPrice = option.adult_price ?? pricingData.value.adult_price
  let childPrice = option.child_price ?? pricingData.value.child_price

  // Check if pricing groups exist
  if (option.pricing_groups && option.pricing_groups.length > 0) {
    const group = option.pricing_groups.find(
      g => totalPeople >= g.from && totalPeople <= g.to
    )

    if (group) {
      adultPrice = group.price
      childPrice = group.child_price
    }
  }

  const total = adultPrice * adults + childPrice * children
  return total
}
const { deleteData } = useApi()

const deleteBtnLoading = ref(false)
const editBtnLoading = ref(false)
const deleteItem = async () => {
  deleteBtnLoading.value = true
  await deleteData(`cart/remove/${props.tour.tour.id}`).then((res) => {
    if (res.status) {
      deleteBtnLoading.value = false
      toast.success(res.message)
      emits('updateCart')
    }
  })
}

watch([nativeCalculate, totalOptionsPrice, total], (newVal) => {
  emits('updateTotal', { subTotal: newVal[0] ?? 0, addons: newVal[1] ?? 0, total: newVal[2] ?? 0 })
}, {
  immediate: true
})

const tourEditData = ref(null)

const getTourData = async () => {
  editBtnLoading.value = true
  await getData(`tours/${tour.value.tour.slug}?includes=seo,destinations,categories,options,days,seasons`).then((res) => {
    tourEditData.value = res.data
    editBtnLoading.value = false
  })
}
</script>

<style scoped lang='scss'></style>