<template>
  <section class="py-6 md:px-10 px-4 bg-white md:rounded-2xl">
    <RentACarFormQuickInfo @getRouteById="getRoute" :locations="locations" v-show="step == 1"
      :initialValues="initialValues" @submitForm="submit"
      @emptyDropLocation="initialValues.quickInfo.dropLoaction = ''" />

    <RentACarFormPersonalInfo :nationalities="nationalities.map((ele) => {
      return {
        name: ele.name,
        id: ele.id
      }
    })" v-show="step == 2" :initialValues="initialValues" @submitForm="submit" />

    <RentACarFormConfirmation v-if="step == 3" :nationalities="nationalities" :money="money" :locations="locations"
      :initialValues="initialValues" @submitForm="submit" @getFirstSpte="emits('getFirstSpte')" />
  </section>
</template>

<script setup lang="js">
import { storeToRefs } from 'pinia'
import { sharedStore } from '~/stores/sharedStore.js'
const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()
const toast = useNuxtApp().$toast
const emits = defineEmits(['next', 'getFirstSpte'])
const props = defineProps({
  step: {
    type: Number,
    required: true
  }
})
const { nationalities } = storeToRefs(sharedStore())
const { getData, postData } = useApi()
const locations = ref([])

const step = ref(props.step)

const initialValues = ref({
  quickInfo: {
    type: route.query.type ?? 'oneWay',
    picupDate: route.query.picupDate ?? null,
    returnDate: route.query.returnDate ?? null,
    location: route.query.location ?? null,
    dropLoaction: route.query.dropLoaction ?? null,
    money: null
  },
  personalInfo: {
    fullName: null,
    email: null,
    phone: null,
    nationality: null,
    adult: 1,
    children: 0,
    infants: 0,
    phoneCode: "",
  }
});

const money = ref("")
const getRoute = async (data) => {
  const body = {
    destination_id: data.location,
    pickup_location_id: data.dropLocation
  }
  await postData('car/rental/search/for/route', body).then((res) => {
    money.value = res.data.prices
  })
}
if (initialValues.value.quickInfo.location) {
  getRoute({ location: initialValues.value.quickInfo.location, dropLocation: initialValues.value.quickInfo.dropLoaction })
}

watch(() => props.step, (val) => {
  step.value = val
})

const emptyQuires = () => {
  router.replace({
    path: route.path,
    query: {}
  });
}
emptyQuires()

const submit = async (values, st) => {
  if (st == 3) {
    const isToken = useCookie("sunpyramids-token").value ? true : false
    const body = {
      pickup_location_id: initialValues.value.quickInfo.location,
      destination_id: initialValues.value.quickInfo.dropLoaction,
      pickup_date: formatFromFullDate(initialValues.value.quickInfo.picupDate, "date"),
      pickup_time: formatFromFullDate(initialValues.value.quickInfo.picupDate, "time"),
      oneway: initialValues.value.quickInfo.type == 'oneWay' ? true : false,
      adults: initialValues.value.personalInfo.adult,
      children: initialValues.value.personalInfo.children,
      name: initialValues.value.personalInfo.fullName,
      email: initialValues.value.personalInfo.email,
      phone: initialValues.value.personalInfo.phone,
      currency_id: 1,
      nationality: nationalities.value.find((ele) => ele.id == initialValues.value.personalInfo.nationality).name,
      stops: []
    }
    if (initialValues.value.quickInfo.returnDate) {
      body['return_date'] = formatFromFullDate(initialValues.value.quickInfo.returnDate, "date")
      body['return_time'] = formatFromFullDate(initialValues.value.quickInfo.returnDate, "time")
    }

    await postData('cart/rentals/append', body, isToken).then((res) => {
      toast.success(res.message)
      setTimeout(() => {
        router.push(localePath("/"))
      }, 2000);
    })
  } else {
    const keys = Object.keys(values);
    const initValues = st == 1 ? initialValues.value.quickInfo : initialValues.value.personalInfo;
    // if (st == 1 && !initialValues.value.personalInfo.money) {
    //   getRoute()
    // }
    keys.forEach((key) => {
      initValues[key] = values[key];
    });
    emits("next")
  }
};

const getLocations = async () => {
  await getData('locations?page_limit=200&order_by=id,asc').then((res) => {
    locations.value = res.data.data
  })
}
getLocations()

const getNationalities = async () => {
  await getData('countries').then((res) => {
    nationalities.value = res.data.map((ele) => {
      return {
        name: ele.name,
        id: ele.id
      }
    })
  })
}
getNationalities()

function formatFromFullDate(fullDate, type) {
  const dateObj = new Date(fullDate); // Convert full date string to Date object

  if (type === 'date') {
    return dateObj.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
  }

  if (type === 'time') {
    return dateObj.toTimeString().slice(0, 5); // Format: "HH:MM"
  }

  return "Invalid type, use 'date' or 'time'";
}


</script>
