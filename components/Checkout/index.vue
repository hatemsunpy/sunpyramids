<template>
  <div class="mt-[2.375rem] xl:mx-20 lg:mx-4 mx-0  mb-14">

    <SharedStepper title="checkout.checkout" :items="steps" :step="currentStep" :isFromHome="false"
      @back="currentStep -= 1" />

    <div>
      <CheckoutStepsBilling @updateData="submitPayment" v-show="currentStep == 2" />

      <CheckoutStepsPaymet v-show="currentStep == 3" @getPayment="updatePaymentMedthod" />
    </div>


  </div>
</template>

<script setup lang='js'>
import { sharedStore } from '~/stores/sharedStore.js'
import { storeToRefs } from 'pinia'

const { selectedCurrancies } = storeToRefs(sharedStore())
const steps = ["checkout.cartDetails", "checkout.baillingDetails", "checkout.paymentMethod"]
const currentStep = ref(2)
const { postData, getData } = useApi()

const router = useRouter()
const localePath = useLocalePath()
const paymentData = ref(null)
const paymentMethods = ref([])
const successPaymentData = ref(null)
const toast = useNuxtApp().$toast

const updatePaymentData = (data) => {
  paymentData.value = data
  currentStep.value += 1
}

watch(currentStep, (val) => {
  if (val == 1) {
    router.push(localePath('/cart'))
  }
})

const submitPayment = async (data) => {
  paymentData.value = data

  const body = {
    first_name: paymentData.value.fullName.split(" ")[0],
    last_name: paymentData.value.fullName.split(" ")[1] ?? "none",
    phone: paymentData.value.phone,
    email: paymentData.value.email,
    country: paymentData.value.country,
    state: paymentData.value.state,
    pickup_location: paymentData.value.locationUp,
    note: paymentData.value.note,
    currency_id: selectedCurrancies.value.id,
    // payment_method: value,
    // payment_method_id: value == "card" ? 9 : null,
    coupon_id: paymentData.value.couponId,
  }
  await postData(`bookings`, body).then((res) => {
    successPaymentData.value = res.data.booking
    toast.success(res.message)
    setTimeout(() => {
      currentStep.value += 1
    }, 1000);
    setTimeout(() => {
      window.location.href = res.data.payment.redirect.location
    }, 1000);
  })

  // const getpaymentsMethods = async () => {
  //   await getData('payments/fawaterk/methods').then(() => {
  //     paymentMethods.value = res.data
  //   })
  // }
  // setTimeout(() => {
  //   getpaymentsMethods()
  // }, 300);
}

const updatePaymentMedthod = async (value) => {
  const body = {
    payment_method: value,
    payment_method_id: value == "card" ? 9 : null,
  }

  await postData(`bookings/update/${successPaymentData.value.id}`, body).then((res) => {
    toast.success(res.data.payment.message)

    setTimeout(() => {
      window.location.href = res.data.payment.redirect.location
    }, 1000);
  })
}
</script>

<style scoped lang='scss'></style>