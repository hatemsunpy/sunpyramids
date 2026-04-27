<script setup>
// import abort from "~/utils/abort";

const localePath = useLocalePath()
const route = useRoute()
const verifying = ref(true);
const { t } = useI18n();

useHead({
  title: t('labels.payment_rejected')
})
// const { data, error } = await useAPI('payments/fawaterk/update/invoice', {
//   params: {
//     invoice_id: route.query.invoice_id,
//   }
// })

// if (error.value) {
//   let message = error?.value?.data?.message || t('errorMessages.somethingWentWrong')
//   abort(error?.value?.statusCode || 400, message)
// } else {
//   verifying.value = false;
// }

const { getData } = useApi()
onMounted(async () => {
  console.log(route.query.invoice_id)
  if (route.query.invoice_id) {
    const res = await getData(`payments/fawaterk/update/invoice?invoice_id=${route.query.invoice_id}`)
    if (res.status) verifying.value = false
  }
})



</script>

<template>
  <div class="px-20  bg-white min-h-96 py-20">
    <div class="d-grid place-items-center" v-if="verifying">
      <UILoadingData />
    </div>
    <div v-else class="flex justify-center content-center">
      <div class="success-text">
        <div class="checkmark">
          <svg class="star" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
            </path>
          </svg>
          <svg class="star" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
            </path>
          </svg>
          <svg class="star" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
            </path>
          </svg>
          <svg class="star" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
            </path>
          </svg>
          <svg class="star" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
            </path>
          </svg>
          <svg class="star" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z">
            </path>
          </svg>

          <svg class="checkmark__check" xmlns="http://www.w3.org/2000/svg" height="36" width="48"
            viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.-->
            <path
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
          <svg fill="#f5931a" class="checkmark__background" height="115" viewBox="0 0 120 115" width="120"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M107.332 72.938c-1.798 5.557 4.564 15.334 1.21 19.96-3.387 4.674-14.646 1.605-19.298 5.003-4.61 3.368-5.163 15.074-10.695 16.878-5.344 1.743-12.628-7.35-18.545-7.35-5.922 0-13.206 9.088-18.543 7.345-5.538-1.804-6.09-13.515-10.696-16.877-4.657-3.398-15.91-.334-19.297-5.002-3.356-4.627 3.006-14.404 1.208-19.962C10.93 67.576 0 63.442 0 57.5c0-5.943 10.93-10.076 12.668-15.438 1.798-5.557-4.564-15.334-1.21-19.96 3.387-4.674 14.646-1.605 19.298-5.003C35.366 13.73 35.92 2.025 41.45.22c5.344-1.743 12.628 7.35 18.545 7.35 5.922 0 13.206-9.088 18.543-7.345 5.538 1.804 6.09 13.515 10.696 16.877 4.657 3.398 15.91.334 19.297 5.002 3.356 4.627-3.006 14.404-1.208 19.962C109.07 47.424 120 51.562 120 57.5c0 5.943-10.93 10.076-12.668 15.438z">
            </path>
          </svg>
        </div>
        <h2 class="text-red-400 font-bold text-4xl">{{ $t('labels.payment_rejected') }}</h2>
        <p>{{ $t('labels.payment_failed_message') }}</p>
        <nuxt-link :to="localePath('/contact-us')"
          class="px-5 py-3 bg-red-600 hover:bg-red-400 font-bold text-white shadow-lg cursor-pointer rounded-md mt-10 inline-block text-center mx-auto">
          {{ $t('labels.contact') }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>



<style scoped>
svg {
  fill: #f51313 !important
}

.checkmark__check {
  fill: #fff !important
}
</style>