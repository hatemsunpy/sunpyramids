<script setup>
// import abort from "~/utils/abort";
const localePath = useLocalePath()
const route = useRoute()
const verifying = ref(true);
const { t } = useI18n();

useHead({
  title: t('labels.payment_pending')
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
              d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64V75c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437v11c-17.7 0-32 14.3-32 32s14.3 32 32 32H64 320h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V437c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1V64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320 64 32zM96 75V64H288V75c0 19-5.6 37.4-16 53H112c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9H112z" />
          </svg>
          <svg fill="#f5931a" class="checkmark__background" height="115" viewBox="0 0 120 115" width="120"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M107.332 72.938c-1.798 5.557 4.564 15.334 1.21 19.96-3.387 4.674-14.646 1.605-19.298 5.003-4.61 3.368-5.163 15.074-10.695 16.878-5.344 1.743-12.628-7.35-18.545-7.35-5.922 0-13.206 9.088-18.543 7.345-5.538-1.804-6.09-13.515-10.696-16.877-4.657-3.398-15.91-.334-19.297-5.002-3.356-4.627 3.006-14.404 1.208-19.962C10.93 67.576 0 63.442 0 57.5c0-5.943 10.93-10.076 12.668-15.438 1.798-5.557-4.564-15.334-1.21-19.96 3.387-4.674 14.646-1.605 19.298-5.003C35.366 13.73 35.92 2.025 41.45.22c5.344-1.743 12.628 7.35 18.545 7.35 5.922 0 13.206-9.088 18.543-7.345 5.538 1.804 6.09 13.515 10.696 16.877 4.657 3.398 15.91.334 19.297 5.002 3.356 4.627-3.006 14.404-1.208 19.962C109.07 47.424 120 51.562 120 57.5c0 5.943-10.93 10.076-12.668 15.438z">
            </path>
          </svg>
        </div>
        <h2 class="text-gray-400 font-bold text-4xl">{{ $t('labels.payment_pending') }}</h2>
        <p>{{ $t('labels.payment_on_hold_message') }}</p>
        <nuxt-link :to="localePath('/contact-us')"
          class="px-5 py-3 bg-gray-500 hover:bg-gray-400 font-bold text-white shadow-lg cursor-pointer rounded-md mt-10 inline-block text-center mx-auto">{{
            $t('labels.contact') }}</nuxt-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
svg {
  fill: #ccc !important
}

.checkmark__check {
  fill: #fff !important
}
</style>