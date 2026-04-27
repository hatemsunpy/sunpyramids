<template>
  <section class="py-6 md:px-10 px-4  bg-white md:rounded-2xl">
    <MakeYourTripFormQuickInfo v-if="step == 1" :initialValues="initialValues" @submitForm="submit" />

    <MakeYourTripFormPersonalInfo v-show="step == 2" :initialValues="initialValues" @submitForm="submit" :nationalities="nationalities.map((ele) => {
      return {
        name: ele.name,
        id: ele.id
      }
    })" />

    <MakeYourTripFormConfirmation v-if="step == 3" :initialValues="initialValues" @submitForm="submit" :nationalities="nationalities.map((ele) => {
      return {
        name: ele.name,
        id: ele.id
      }
    })" @getFirstSpte="emits('getFirstSpte')" />
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
const { postData } = useApi()

const { nationalities } = storeToRefs(sharedStore())

const step = ref(props.step)

const initialValues = ref({
  quickInfo: {
    type: route.query.type ?? 'existTime',
    fromDate: route.query.from ?? null,
    toDate: route.query.to ?? null,
    month: route.query.month ?? null,
    days: route.query.days ?? null,
  },
  personalInfo: {
    fullName: null,
    email: null,
    phone: null,
    nationality: null,
    adult: 1,
    children: 0,
    infants: 0,
    min: 1000,
    max: 3000,
    flightOffer: false,
    note: "",
    phoneCode: ""
  }
});

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
  if (st == 2) {
    const keys = Object.keys(values);
    const initValues = st == 1 ? initialValues.value.quickInfo : initialValues.value.personalInfo;
    keys.forEach((key) => {
      initValues[key] = values[key];
    });

    const isToken = useCookie("sunpyramids-token").value ? true : false
    const token = await generateRecaptchaToken('6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn', 'submit');
    const body = {
      destination: "egypt",
      type: initialValues.value.quickInfo.type == 'existTime' ? 'exact_time' : initialValues.value.quickInfo.type == 'approximateTime' ? 'approx_time' : 'not_sure',
      name: initialValues.value.personalInfo.fullName,
      first_name: initialValues.value.personalInfo.fullName,
      last_name: '',
      phone_number: initialValues.value.personalInfo.phone,
      email: initialValues.value.personalInfo.email,
      adults: initialValues.value.personalInfo.adult,
      children: initialValues.value.personalInfo.children,
      infants: initialValues.value.personalInfo.infants,
      nationality: nationalities.value.find((ele) => ele.id == initialValues.value.personalInfo.nationality).name,
      min_person_budget: initialValues.value.personalInfo.min,
      max_person_budget: initialValues.value.personalInfo.max,
      flight_offer: initialValues.value.personalInfo.flightOffer,
      additional_notes: initialValues.value.personalInfo.note,
      recaptcha_token: token,
    }
    if (initialValues.value.quickInfo.type == 'existTime') {
      body['start_date'] = formatFromFullDate(initialValues.value.quickInfo.fromDate, "date")
      body['end_date'] = formatFromFullDate(initialValues.value.quickInfo.toDate, "date")
    } else if (initialValues.value.quickInfo.type == 'approximateTime') {
      body['month'] = initialValues.value.quickInfo.month.month
    } else {
      body['days'] = initialValues.value.quickInfo.days
    }


    await postData('custom/trips', body, isToken).then((res) => {
      // toast.success(res.message)
      router.push(localePath(`/thankful?name=${initialValues.value.personalInfo.fullName}`))
    }).catch((err) => {
      toast.error(err.message)
    })
  } else {
    const keys = Object.keys(values);
    const initValues = st == 1 ? initialValues.value.quickInfo : initialValues.value.personalInfo;
    keys.forEach((key) => {
      initValues[key] = values[key];
    });
    emits("next")
  }
};

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
