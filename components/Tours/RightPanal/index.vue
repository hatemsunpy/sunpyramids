<template>
  <div class="relative w-full lg:block hidden" :class="[tour && tour?.offer != 0 ? 'pt-0' : 'pt-0']">
    <div class="sticky top-[145px]">

      <div v-if="tour && tour?.offer != 0"
        class="w-3/4 rounded-t-3xl bg-[#f55157] flex items-center justify-center gap-[6px]  mx-auto text-center">

        <NuxtIcon name="discount" class="text-white" />

        <p class="text-white text-sm">{{ $t('labels.spaicalOffer') }}</p>
      </div>

      <div class="p-5 border boxShadowRightPanal border-[#EEEEEE] rounded-3xl">
        <div class="flex justify-between items-end mb-4">
          <div>
            <p class="text-sm text-[#666666] mb-2">
              {{ $t("inputLabels.price") }}
            </p>

            <div class="flex items-end gap-2">
              <p class="text-3xl font-bold">{{ selectedCurrancies.symbol }}{{ (tour && tour?.offer != 0 ?
                priceWithDiscount.toFixed(2) : nativeCalculate.toFixed(2)) }}</p>

              <p v-if="tour && tour?.offer != 0"
                class="text-xl font-medium  text-[#A5A5A5] line-through decoration-2 decoration-[#F55157]">
                {{ selectedCurrancies.symbol }}{{ nativeCalculate.toFixed(2) }}
              </p>
            </div>
          </div>

          <UIButton :text="$t('labels.tours.share')" @click="shareTour"
            :classes="['py-4 gap-3 font-medium hover:!text-white hover:bg-textDark duration-0 !px-8 border !text-textDark']"
            preIcon="send" :preIconClasses="['!text-textDark group-hover:!text-white text-2xl w-5 h-5']" />
        </div>

        <div v-if="tour && tour?.offer" class="rounded-2xl overflow-hidden grid grid-cols-4 gap-1 mb-6 ">
          <div v-for="(item, index) in timeValues" :key="index" class="bg-[#FFF2F3] py-1 px-2 text-center">
            <p class="text-[#F55157] text-sm font-medium">{{ timer[item.value] }}</p>

            <p class="text-xs text-[#F9979A]">
              {{ $t(`labels.time.${item.title}`) }}
            </p>
          </div>
        </div>

        <VeeForm :validation-schema="schema" :initial-values="initialValues" v-slot="{ values, errors }"
          @submit="submit">
          <UIShortcutsDate :istop="false" :disabled="!tour" :condition="getDisabledDays" name="date"
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

          <div v-if="tour && tour?.options.length">
            <p class="text-xl font-medium mb-3 text-textLight">{{ $t('labels.tours.amount') }}</p>

            <div class="flex gap-2 ps-2 items-center">
              <p class="font-medium">{{ $t('labels.tours.addOns') }}</p>

              <div class="text-xs text-primary cursor-pointer flex gap-1 items-center" @click="isSee = !isSee">
                <p>{{ $t('labels.tours.seeDetails') }}</p>

                <NuxtIcon name="arrow-down" class="transition-all" :class="[isSee ? 'rotate-180' : ' rotate-0']" />
              </div>


              <p class="ms-auto text-xl font-medium">{{ selectedCurrancies.symbol }}{{ (totalOptionsPrice).toFixed(2)
              }}</p>

            </div>
            <div v-show="isSee">
              <div v-for="item in tour.options"
                class="flex ps-10 items-center justify-between hover:bg-[#eeeeee] py-2 rounded-lg transition-colors">
                <div class="maincntr flex gap-2 items-center group w-fit">
                  <input v-model="addsValues" :value="item.id" type="checkbox" name="catogries"
                    :id="item.id + '-addons-rp'" class="hidden-xs-up maincbxInput" />
                  <label :for="item.id + '-addons-rp'"
                    class="maincbx group-hover:border-[#0d2359] checked: transition-colors"></label>

                  <label :for="item.id + '-addons-rp'"
                    class="font-medium cursor-pointer group-hover:text-[#0d2359] transition-colors">{{ item.name
                    }}</label>
                </div>

                <p class="text-sm text-primary font-medium">{{ selectedCurrancies.symbol }}{{ (item.adult_price *
                  selectedCurrancies.exchange_rate).toFixed(2) }}</p>
              </div>
            </div>

          </div>

          <div class="col-span-2 mb-10 flex justify-between mt-4 items-center">
            <h6 class="font-medium">{{ $t('labels.tours.total') }}</h6>

            <h4 class="font-medium text-[2.1rem] text-secondary">{{ selectedCurrancies.symbol }}{{
              ((isNaN(total) ? 0 : total)).toFixed(2) }}</h4>
          </div>

          <div class="my-6">
            <UIButton type="submit" :loading="loadingbtn"
              :classes="['w-full py-4 hover:bg-[#143485]  font-medium text-white bg-primary !justify-center']"
              :text="$t('labels.tours.BookNow')" />
          </div>
        </VeeForm>

        <div class="flex 2xl:flex-row flex-col gap-2 items-center justify-between mt-4">
          <UIButton @mouseenter="isHoverHeart = true" @mouseleave="isHoverHeart = false" @click="likeTour"
            :text="$t('labels.tours.favorites')"
            :classes="['py-4 gap-3 font-medium !justify-center !w-full  duration-0  border !text-textDark']"
            :preIcon="tour?.wishlisted_exists ? 'heart' : isHoverHeart ? 'heart' : 'heart-nonfill'"
            :preIconClasses="['text-2xl w-5 h-5', tour?.wishlisted_exists ? '!text-[#f55157]' : isHoverHeart ? 'group-hover:text-[#fccbcd] ' : '!text-[#DEDEDE]']" />

          <UIButton :text="$t('labels.tours.askQuestion')" @click="shareOnWhatsApp"
            :classes="['py-4 gap-3 font-medium !justify-center hover:!text-white !w-full hover:bg-textDark duration-0  border !text-textDark']"
            preIcon="message-2" :preIconClasses="['!text-textDark group-hover:!text-white text-2xl w-5 h-5']" />
        </div>


      </div>
    </div>
  </div>

  <div class="fixed submitBoxShadow lg:hidden z-40 bottom-0 start-0 w-full ">
    <div v-if="tour && tour?.offer != 0" class="w-full">
      <div class="w-full rounded-t-3xl bg-[#f55157] flex items-center justify-center gap-[6px]  mx-auto text-center">

        <NuxtIcon name="discount" class="text-white" />

        <p class="text-white text-sm">{{ $t('labels.spaicalOffer') }}</p>
      </div>
    </div>


    <div class="relative w-full h-full p-4 bg-white flex gap-5 items-end">
      <div>
        <p class="text-sm text-[#666666] mb-2">
          {{ $t("inputLabels.price") }}
        </p>

        <div class="flex items-end gap-2">
          <p class="text-3xl font-bold">{{ selectedCurrancies.symbol }}{{ (tour && tour?.offer != 0 ?
            priceWithDiscount.toFixed(2) : nativeCalculate.toFixed(2)) }}</p>

          <p v-if="tour && tour?.offer != 0"
            class="text-xl font-medium  text-[#A5A5A5] line-through decoration-2 decoration-[#F55157]">
            {{ selectedCurrancies.symbol }}{{ nativeCalculate.toFixed(2) }}
          </p>
        </div>
      </div>

      <UIButton type="submit" @click="isBookModelOpen = true" :classes="[
        'py-4 !h-full !px-12 min-w-fit gap-2 !w-full border !justify-center bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
      ]" :text="$t('labels.tours.BookNow')" />
    </div>
  </div>

  <div v-if="isBookModelOpen"
    class="fixed w-full h-screen bg-black/70 flex items-end  lg:hidden z-50 bottom-0 start-0 ">
    <div class="h-[90vh] pb-[160px] flex flex-col w-full ">
      <div v-if="tour && tour?.offer != 0"
        class="w-3/4 rounded-t-3xl bg-[#f55157] flex items-center justify-center gap-[6px]  mx-auto text-center">

        <NuxtIcon name="discount" class="text-white" />

        <p class="text-white text-sm">{{ $t('labels.spaicalOffer') }}</p>
      </div>

      <div class="!h-full bg-white overflow-hidden rounded-t-3xl">
        <div class="p-5 border boxShadowRightPanal border-[#EEEEEE] h-full rounded-t-3xl overflow-y-auto">
          <div class="flex justify-between items-end mb-4">
            <div>
              <p class="text-sm text-[#666666] mb-2">
                {{ $t("inputLabels.price") }}
              </p>

              <div class="flex items-end gap-2">
                <p class="text-3xl font-bold">{{ selectedCurrancies.symbol }}{{ (tour && tour?.offer != 0 ?
                  priceWithDiscount.toFixed(2) : nativeCalculate.toFixed(2)) }}</p>

                <p v-if="tour && tour?.offer != 0"
                  class="text-xl font-medium  text-[#A5A5A5] line-through decoration-2 decoration-[#F55157]">
                  {{ selectedCurrancies.symbol }}{{ nativeCalculate.toFixed(2) }}
                </p>
              </div>
            </div>

            <UIButton :text="$t('labels.tours.share')" @click="shareTour"
              :classes="['py-4 gap-3 font-medium hover:!text-white hover:bg-textDark duration-0 !px-8 border !text-textDark']"
              preIcon="send" :preIconClasses="['!text-textDark group-hover:!text-white text-2xl w-5 h-5']" />
          </div>

          <div v-if="tour && tour?.offer" class="rounded-2xl overflow-hidden grid grid-cols-4 gap-1 mb-6 ">
            <div v-for="(item, index) in timeValues" :key="index" class="bg-[#FFF2F3] py-1 px-2 text-center">
              <p class="text-[#F55157] text-sm font-medium">{{ timer[item.value] }}</p>

              <p class="text-xs text-[#F9979A]">
                {{ $t(`labels.time.${item.title}`) }}
              </p>
            </div>
          </div>

          <VeeForm :validation-schema="schema" :initial-values="initialValues" v-slot="{ values, errors }"
            @submit="submit">
            <UIShortcutsDate :istop="false" :disabled="!tour" :condition="getDisabledDays" name="date"
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

            <div v-if="tour && tour?.options.length">
              <p class="text-xl font-medium mb-3 text-textLight">{{ $t('labels.tours.amount') }}</p>

              <div class="flex gap-2 ps-2 items-center">
                <p class="font-medium">{{ $t('labels.tours.addOns') }}</p>

                <div class="text-xs text-primary cursor-pointer flex gap-1 items-center" @click="isSee = !isSee">
                  <p>{{ $t('labels.tours.seeDetails') }}</p>

                  <NuxtIcon name="arrow-down" class="transition-all" :class="[isSee ? 'rotate-180' : ' rotate-0']" />
                </div>


                <p class="ms-auto text-xl font-medium">{{ selectedCurrancies.symbol }}{{ (totalOptionsPrice).toFixed(2)
                }}</p>

              </div>
              <div v-show="isSee">
                <div v-for="item in tour.options"
                  class="flex ps-10 items-center justify-between hover:bg-[#eeeeee] py-2 rounded-lg transition-colors">
                  <div class="maincntr flex gap-2 items-center group w-fit">
                    <input v-model="addsValues" :value="item.id" type="checkbox" name="catogries"
                      :id="item.id + '-addons-rp'" class="hidden-xs-up maincbxInput" />
                    <label :for="item.id + '-addons-rp'"
                      class="maincbx group-hover:border-[#0d2359] checked: transition-colors"></label>

                    <label :for="item.id + '-addons-rp'"
                      class="font-medium cursor-pointer group-hover:text-[#0d2359] transition-colors">{{ item.name
                      }}</label>
                  </div>

                  <p class="text-sm text-primary font-medium">{{ selectedCurrancies.symbol }}{{ (item.adult_price *
                    selectedCurrancies.exchange_rate).toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <div class="absolute start-0 bottom-0 w-full">
              <div class="col-span-2 mb-10 flex justify-between mt-4 items-center">
                <h6 class="font-medium">{{ $t('labels.tours.total') }}</h6>

                <h4 class="font-medium text-[2.1rem] text-secondary">{{ selectedCurrancies.symbol }}{{
                  ((isNaN(total) ? 0 : total)).toFixed(2) }}</h4>
              </div>

              <div
                class="md:hidden submitBoxShadow submitBoxShadow flex flex-col gap-5 z-20 fixed w-full bg-[#ffffff] p-4 bottom-0  start-0 ">
                <div class="flex justify-between items-center">
                  <h6 class="font-medium">{{ $t('labels.tours.total') }}</h6>

                  <h4 class="font-medium text-[2.1rem] text-secondary">{{ selectedCurrancies.symbol }}{{
                    ((isNaN(total) ? 0 : total)).toFixed(2) }}</h4>
                </div>

                <div class="flex ">
                  <UIButton @click="isBookModelOpen = false" type="button" :classes="[
                    'py-4 !px-12 font-medium border !w-full me-2 !justify-center  gap-2 border-[1px] text-textDark   font-meduim hover:text-white border-textLight hover:bg-textDark',
                  ]" :text="$t('labels.cancel')" />

                  <UIButton type="submit" :loading="loadingbtn" :classes="[
                    'py-4 !px-12 min-w-fit gap-2 !w-full border !justify-center bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
                  ]" :text="$t('labels.tours.BookNow')" />
                </div>
              </div>
            </div>

          </VeeForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='js'>
import { sharedStore } from '~/stores/sharedStore.js'
import { storeToRefs } from 'pinia'
import { configure } from "vee-validate";
import * as yup from "yup";
const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();

const toast = useNuxtApp().$toast

const isSee = ref(true)
const isBookModelOpen = ref(false)



const props = defineProps({
  tour: {
    type: Object,
    required: true
  },
  addsValues: {
    type: Array,
    default: () => []
  }
})

const addsValues = ref([])
const emits = defineEmits(['update:adds', "update:price"])
watch(addsValues, () => {
  emits('update:adds', addsValues.value)
})

watch(() => props.addsValues, (newVal) => {
  addsValues.value = newVal
}, {
  deep: true,
  immediate: true
})



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
    if (tour.value?.offer_end_date)
      if (process.client) {
        setInterval(() => {
          calculateDuration(tour.value?.offer_end_date)
        }, 1000);
      }
  }
}, {
  deep: true,
  immediate: true
})

const getDisabledDays = (thisDate) => {
  if (tour.value) {
    const date = new Date(thisDate);
    const {
      day_numbers = [],
      day_names = [],
      month_names = [],
      years = []
    } = tour.value?.calender_availability || {};

    // If all arrays are empty, consider all dates available
    if (day_numbers.length === 0 &&
      day_names.length === 0 &&
      month_names.length === 0 &&
      years.length === 0) {
      return false;
    }

    const dayNumber = date.getDate();
    const dayName = date.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    const monthName = date.toLocaleString('en-us', { month: 'long' }).toLowerCase();
    const year = date.getFullYear();

    const isAvailable =
      (day_numbers.length === 0 || day_numbers.includes(dayNumber)) &&
      (day_names.length === 0 || day_names.includes(dayName)) &&
      (month_names.length === 0 || month_names.includes(monthName)) &&
      (years.length === 0 || years.includes(year));

    return !isAvailable;
  } else {
    return false;
  }
};

const { selectedCurrancies } = storeToRefs(sharedStore())


configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const schema = yup.object().shape({
  date: yup.date().required(),
  adult: yup.number(),
  children: yup.string(),
  infants: yup.string(),
});



const initialValues = {
  adult: 1,
  infants: 0,
  children: 0
}

const selectData = ref({
  adult: 1,
  children: 0,
  infants: 0,
  date: null
})

const { postData, putData } = useApi()


configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});


const timer = ref({
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00'
})
const timeValues = [{ title: "day", value: "days" }, { title: "hour", value: "hours" }, { title: "minute", value: "minutes" }, { title: "second", value: "seconds" }]

function calculateDuration(dateString) {
  const targetDate = new Date(dateString).getTime(); // Convert input date to timestamp
  const now = Date.now(); // Current timestamp in milliseconds
  const diff = Math.abs(targetDate - now); // Calculate the difference

  const days = Math.floor(diff / (3600 * 24 * 1000));
  const hours = Math.floor((diff % (3600 * 24 * 1000)) / (3600 * 1000));
  const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  timer.value = {
    days: days < 10 ? '0' + days : days.toString(),
    hours: hours < 10 ? '0' + hours : hours.toString(),
    minutes: minutes < 10 ? '0' + minutes : minutes.toString(),
    seconds: seconds < 10 ? '0' + seconds : seconds.toString(),
  };
}

// calculate price
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

    return (total + adultTotal + childTotal)
  }, 0)
})



const totalOptionsPrice = computed(() => {
  return selectedCurrancies.value.exchange_rate * (totalOptionsPricebc.value ?? 0)
})
const total = computed(() => {
  return totalOptionsPrice.value + priceWithDiscount.value
})

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
    router.push(localePath('/cart'))

  })
}

const shareTour = async () => {
  navigator.share({
    title: document.title,
    text: 'Check this out!',
    url: window.location.href,
  });
};

watch([nativeCalculate, priceWithDiscount], (newVal) => {
  emits("update:price", {
    price: newVal[0],
    withDicount: newVal[1]
  })
})

if (process.client) {
  setTimeout(() => {

    emits("update:price", {
      price: nativeCalculate.value,
      withDicount: priceWithDiscount
    })
  }, 500);
}

const shareOnWhatsApp = () => {
  const message = `I want to inquire about a tour (${tour.value.title}) \n`;
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = "201095888830"; // Optional: like "201234567890"
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(url, '_blank');
};

const isLiked = ref(false)
const isHoverIn = ref(false)
const isHoverHeart = ref(false)

const likeTour = async () => {
  const token = useCookie('sunpyramids-token').value
  if (!token) {
    toast.error('Please login to like the tour')
  } else {
    await putData(`wishlist/${tour.value.id}/toggle`).then(() => {
      tour.valuewishlisted_exists = !tour.valuewishlisted_exists
      toast.success(tour.valuewishlisted_exists ? 'Tour added to wishlist' : 'Tour removed from wishlist')
    }).catch((err) => {
      toast.error(err.data.message)
    })
  }
}
</script>

<style scoped lang='scss'>
.boxShadowRightPanal {
  box-shadow: 0px 8px 24px #00000014;
}
</style>