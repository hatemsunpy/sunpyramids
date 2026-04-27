<template>
  <Auth>
    <section>
      <h4 class="font-medium text-[2.125rem] mb-5">
        {{ $t("labels.auth.forgetPassword.title") }}
      </h4>

      <p class="leading-6 font-medium  text-[#A5A5A5] mb-10">
        {{ $t("labels.auth.forgetPassword.paragraph") }}
      </p>

      <div class="">
        <VeeForm :validation-schema="schema" v-slot="{ values, errors }" @submit="submit">
          <div class="mb-10">
            <UIText name="email" :isRequired="true" preIcon="sms-thin"
              :preIconClasses="['text-2xl text-[#333333] !font-normal']" :label="$t('inputLabels.email')" clas />
          </div>

          <div class="flex flex-col w-full gap-6">
            <UIButton type="submit" :classes="[
              'py-4 !px-12 min-w-fit gap-2 border !justify-center bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
            ]" :text="$t('labels.auth.forgetPassword.sendCode')" :loading="isLoading" />

            <div class="flex items-center justify-center font-medium gap-1 leading-[19.17px]">
              <p>{{ $t("labels.auth.forgetPassword.donotHaveAccount") }}</p>
              <NuxtLink class="text-secondary" :to="localePath('/auth/sign-up')">{{
                $t("labels.auth.signup.createNewAccount") }}</NuxtLink>
            </div>
          </div>
        </VeeForm>
      </div>
    </section>
  </Auth>
</template>

<script setup lang="js">
import { configure } from "vee-validate";
import * as yup from "yup";

const router = useRouter()
const localePath = useLocalePath()
const toast = useNuxtApp().$toast
const { postData } = useApi()
const { t } = useI18n()


const isLoading = ref(false)

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const schema = yup.object().shape({
  email: yup
    .string().email(t("errors.email", { name: t("inputLabels.email") }))
    .required(t("errors.isRequired", { name: t("inputLabels.email") }))
  ,
});
const socials = ["google", "linkedin", "twitter-x"]

const submit = async (values) => {
  isLoading.value = true
  const body = {
    email: values.email,
  }

  await postData("auth/password/forget", body).then((res) => {
    toast.success(res.message)
    setTimeout(() => {
      router.push({ path: localePath("/auth/confirm-code"), query: { email: values.email } })
    }, 2000);
  }).catch((err) => {
    toast.error(err.data.message)
    isLoading.value = false
  })
}
</script>

<style scoped lang="scss"></style>
