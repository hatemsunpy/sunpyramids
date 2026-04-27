<template>
  <div class="bg-black/80 fixed flex justify-center items-center top-0 left-0 w-full h-screen z-[99999]">
    <div class="xl:w-1/3 lg:w-1/2 sm:w-3/4 w-[95%] rounded-3xl bg-[#ffffff]">
      <div class="flex justify-between items-center mb-5 p-4">
        <h4 class="text-xl font-medium">
          {{ $t("labels.checkout.editTour") }}
        </h4>

        <button @click="emits('close')"
          class="text-textDark border hover:bg-textDark hover:text-white transition-all border-textDark/30 flex items-center justify-center w-10 h-10 rounded-full">
          <NuxtIcon name="add" class="text-xl rotate-45" />
        </button>
      </div>
      <div class="px-6">
        <VeeForm :validation-schema="schema" :initial-values="initialValues" v-slot="{ values, errors }"
          @submit="submit">
          <UIShortcutsDate :istop="false" :condition="getDisabledDays" name="date" :is-edit="true"
            :title="$t('inputLabels.Date')" :placeholder="$t('inputLabels.DatePlaceholder')" label="inputLabels.Date"
            icon="calender" :minDate="values.fromDate" v-model:value="selectData.date" />

          <div class="col-span-2 grid mt-5 mb-5 grid-cols-1 gap-2">
            <p class="text-xl font-medium text-textLight">{{ $t('labels.tours.passangers') }}</p>

            <div class="grid grid-cols-2 items-center">
              <p class="font-medium">{{ $t('inputLabels.adults') + ' (12+)' }}</p>
              <UICounter :rounded="true" name="adult" v-model:value="selectData.adult" />
            </div>

            <div class="grid grid-cols-2 items-center">
              <p class="font-medium">{{ $t('inputLabels.children') + ' (3 - 11)' }}</p>
              <UICounter :rounded="true" name="children" v-model:value="selectData.children" />
            </div>

            <div class="grid grid-cols-2 items-center">
              <p class="font-medium">{{ $t('inputLabels.infants') + ' (0 - 2)' }}</p>
              <UICounter :rounded="true" name="infants" v-model:value="selectData.infants" />
            </div>
          </div>

          <div v-if="tour.options.length">
            <p class="text-xl font-medium mb-3 text-textLight">{{ $t('labels.tours.amount') }}</p>

            <div class="flex gap-2 ps-2 items-center">
              <p class="font-medium">{{ $t('labels.tours.addOns') }}</p>

              <div class="text-xs text-primary cursor-pointer flex gap-1 items-center" @click="isSee = !isSee">
                <p>{{ $t('labels.tours.seeDetails') }}</p>

                <NuxtIcon name="arrow-down" class="transition-all" :class="[isSee ? 'rotate-180' : ' rotate-0']" />
              </div>


              <p class="ms-auto text-xl font-medium">{{ selectedCurrancies.symbol }}{{ (totalOptionsPrice *
                selectedCurrancies.exchange_rate).toFixed(2) }}</p>

            </div>
            <div v-show="isSee">

              <div v-for="item in tour.options"
                class="flex ps-10 items-center justify-between hover:bg-[#eeeeee] py-2 rounded-lg transition-colors">
                <div class="maincntr flex gap-2 items-center group w-fit">
                  <input v-model="addsValues" :value="item.id" type="checkbox" name="catogries"
                    :id="item.id + '-addons-edit-model'" class="hidden-xs-up maincbxInput" />
                  <label :for="item.id + '-addons-edit-model'"
                    class="maincbx group-hover:border-[#0d2359] checked: transition-colors"></label>

                  <label :for="item.id + '-addons-edit-model'"
                    class="font-medium cursor-pointer group-hover:text-[#0d2359] transition-colors"
                    :class="[addsValues.includes(item.id) ? 'text-primary' : 'text-textDark']">{{
                      item.name
                    }}</label>
                </div>

                <p class="text-sm  font-medium"
                  :class="[addsValues.includes(item.id) ? 'text-primary' : 'text-textDark']">{{
                    selectedCurrancies.symbol }}{{ (item.adult_price *
                    selectedCurrancies.exchange_rate).toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <div class="my-6">
            <UIButton type="submit" :loading="loadingbtn"
              :classes="['w-full py-4 hover:bg-[#143485]  font-medium text-white bg-primary !justify-center']"
              :text="$t('labels.checkout.saveEdits')" />
          </div>
        </VeeForm>
      </div>

    </div>
  </div>
</template>

<script setup lang='js'>
import { configure } from "vee-validate";
import * as yup from "yup";
import { sharedStore } from '~/stores/sharedStore.js'
import { storeToRefs } from 'pinia'
const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();

const isSee = ref(false)

const props = defineProps({
  tour: {
    type: Object,
    required: true,
  },
  infants: {
    type: Number,
    default: 0,
  },
  children: {
    type: Number,
    default: 0,
  },
  adults: {
    type: Number,
    default: 1,
  },
  date: {
    type: String,
    default: new Date().toISOString().split("T")[0],
  },
  selectedAdds: {
    type: Array,
    default: () => [],
  },
});

const { postData } = useApi()
const toast = useNuxtApp().$toast
const isLoading = ref(false)
const { selectedCurrancies } = storeToRefs(sharedStore())


configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const schema = yup.object().shape({
  date: yup.date().required(),
  adult: yup.number().min(1).required(),
  children: yup.string(),
  infants: yup.string(),
});

const initialValues = {
  date: props.date,
  adult: props.adults,
  infants: props.infants,
  children: props.children
}

const selectData = ref({
  adult: props.adults,
  children: props.children,
  infants: props.infants,
  date: props.date
})

const addsValues = ref(props.selectedAdds)
const pricingData = ref({
  adult_price: 0,
  child_price: 0,
  infant_price: 0,
  pricing_groups: [
  ]
})
const seasons = ref([])
const tour = ref(null)
watch(() => props.tour, (newVal) => {
  if (newVal) {
    pricingData.value.adult_price = newVal.adult_price
    pricingData.value.child_price = newVal.child_price
    pricingData.value.infant_price = newVal.infant_price
    if (newVal.pricing_groups) pricingData.value.pricing_groups = newVal.pricing_groups
    if (newVal.seasons) seasons.value = newVal.seasons
    tour.value = newVal
  }
}, {
  deep: true,
  immediate: true
})

const getDisabledDays = (thisDate) => {
  if (tour.value) {
    const date = new Date(thisDate);

    const dayNumber = date.getDate();
    const dayName = date.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    const monthName = date.toLocaleString('en-us', { month: 'long' }).toLowerCase();
    const year = date.getFullYear();
    const {
      day_numbers,
      day_names,
      month_names,
      years
    } = tour.value?.calender_availability || {};

    const isAvailable =
      day_numbers.includes(dayNumber) &&
      day_names.includes(dayName) &&
      month_names.includes(monthName) &&
      years.includes(year);

    return !isAvailable;
  } else {
    return false
  }
};


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
  return nativeCalculate.value - (nativeCalculate.value * (tour.value?.offer / 100))
})


const totalOptionsPrice = computed(() => {
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

const total = computed(() => {
  return totalOptionsPrice.value + priceWithDiscount.value
})

const emits = defineEmits(['close', "updateData"])

const loadingbtn = ref(false)

const submit = async (values) => {
  if (!values.date) {
    toast.error(t(`errors.isRequired`, {
      name: t('inputLabels.Date'),
    }))
    return
  }
  if (values.adult == 0) {
    toast.error(t(`errors.minMemer`, {
      name: t('inputLabels.adults'),
      min: 1
    }))
    return
  }
  loadingbtn.value = true
  const body = {
    tour_id: tour.value.id,
    start_date: values.date,
    adults: selectData.value.adult,
    children: selectData.value.children,
    infants: selectData.value.infants,
    options: addsValues.value
  }

  await postData('cart/tours/append', body).then((res) => {
    toast.success(res.message)
    loadingbtn.value = false
    emits('close')
    emits('updateData')
  })
}
</script>

<style scoped lang='scss'></style>