<template>
  <Auth>
    <section>
      <h4 class="font-medium text-[2.125rem] mb-5">
        {{ $t("labels.auth.confirmCode.title") }}
      </h4>

      <p class="leading-6 font-medium text-[#A5A5A5] mb-10">
        {{
          $t("labels.auth.confirmCode.paragraph", {
            email: route.query.email,
          })
        }}
      </p>

      <div class="">
        <div class="mx-auto mb-10">
          <p class="font-medium mb-3">
            {{ $t("labels.auth.confirmCode.activitionCode") }}
          </p>

          <v-otp-input ref="otpInput" v-model:value="bindModal" input-classes="otp-input" separator="" :num-inputs="6"
            :should-auto-focus="true" input-type="number"
            :conditionalClass="['one', 'two', 'three', 'four', 'five', 'five']" />
        </div>

        <p class="text-sm font-medium mb-10" v-if="seconds != 0">
          {{ $t("labels.auth.confirmCode.codeWillExpired") }}
          <span class="text-secondary">
            {{ $t("labels.auth.confirmCode.inSec", { sec: seconds }) }}</span>
        </p>

        <p class="text-sm font-medium mb-10" v-else>
          <span class="text-secondary cursor-pointer" @click="resendCode">
            {{ $t("labels.auth.confirmCode.resendCode") }}...</span>
        </p>

        <div class="flex flex-col w-fullx mx-auto gap-6">
          <UIButton :disabled="bindModal.length != 6 || seconds == 0" :loading="isLoading" type="submit" @click="submit"
            :classes="[
              'py-4 !px-12 min-w-fit gap-2 border !justify-center bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white disabled:bg-[#eeeeee] disabled:text-[#A5A5A5] disabled:!opacity-100 disabled:border-none',
            ]" :text="$t('labels.confirm')" />
        </div>
      </div>
    </section>
  </Auth>
</template>

<script setup lang="js">
import VOtpInput from "vue3-otp-input";
import { configure } from "vee-validate";
import * as yup from "yup";

const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()
const toast = useNuxtApp().$toast
const { postData } = useApi()

const bindModal = ref("")
const seconds = ref(60)
const isLoading = ref(false)


onMounted(() => {
  countDown()
})

const countDown = () => {
  const timer = setInterval(() => {

    if (seconds.value !== 0) {
      seconds.value -= 1
    }
  }, 1000)

  setTimeout(() => {
    clearInterval(timer)
  }, 60500);
}

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const submit = async () => {
  isLoading.value = true
  const body = {
    email: route.query.email,
    otp: bindModal.value
  }

  await postData("auth/password/otp/verify", body).then((res) => {
    router.push({ path: localePath("/auth/create-password"), query: { email: route.query.email, otp: bindModal.value } })
  }).catch((err) => {
    toast.error(err.data.message)
    isLoading.value = false
  })
}

const resendCode = async () => {
  const body = {
    email: route.query.email,
  }

  await postData("auth/password/forget", body).then((res) => {
    toast.success(res.message)
    seconds.value = 60
    countDown()
  }).catch((err) => {
    toast.error("there are a problem")
  })
}
</script>

<style scoped lang="scss"></style>
