<template>
  <Auth>
    <section>
      <VeeForm :validation-schema="schema" v-slot="{ values, errors }" @submit="submit">
        <h4 class="font-medium text-[2.125rem] mb-5">
          {{ $t("labels.auth.CreatePassword.title") }}
        </h4>

        <p class="leading-6 font-medium text-[#A5A5A5] mb-10">
          {{ $t("labels.auth.CreatePassword.paragraph") }}
        </p>

        <div class="">
          <div class="flex flex-col w-full mx-auto gap-6">
            <UIText name="password" :isRequired="true" :showVisibility="true" type="password" preIcon="lock"
              :preIconClasses="['text-2xl text-[#333333] !font-normal']" :label="$t('inputLabels.password')"
              placeholder="12345678" />

            <UIText name="confirmPassword" :isRequired="true" :showVisibility="true" type="password" preIcon="lock"
              :preIconClasses="['text-2xl text-[#333333] !font-normal']" :label="$t('inputLabels.confirmPassword')"
              placeholder="12345678" />

            <div class="w-full mt-4">
              <UIButton type="submit" :loading="isLoading" :classes="[
                'py-4 w-full !px-12 min-w-fit gap-2 border !justify-center bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white disabled:bg-[#eeeeee] disabled:text-[#A5A5A5] disabled:!opacity-100 disabled:border-none',
              ]" :text="$t('labels.confirm')" />
            </div>
          </div>
        </div>
      </VeeForm>
    </section>
  </Auth>
</template>

<script setup lang="js">
import { configure } from "vee-validate";
import * as yup from "yup";

const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()
const toast = useNuxtApp().$toast
const { postData } = useFetch()
const { t } = useI18n()

const isLoading = ref(false)

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const schema = yup.object().shape({
  password: yup
    .string()
    .required(t("errors.isRequired", { name: t("inputLabels.password") }))
    .min(8, t("errors.min", { name: t("inputLabels.password"), num: 8 })),
  confirmPassword: yup
    .string()
    .required(t("errors.isRequired", { name: t("inputLabels.confirmPassword") }))
    .min(8)
    .oneOf([yup.ref("password")], t("errors.match", { name: t("inputLabels.confirmPassword"), nameTwo: t("inputLabels.password") })),
});

const submit = async (values) => {
  isLoading.value = true
  const body = {
    email: route.query.email,
    token: route.query.token,
    password: values.password,
    password_confirmation: values.confirmPassword
  }

  await postData("client/reset-password", body).then((res) => {
    toast.success(res.message)
    setTimeout(() => {
      router.push(localePath("/auth/sign-in"))
    }, 2000);
  }).catch((err) => {
    toast.error(err.data.message)
    isLoading.value = false
  })
}
</script>

<style scoped lang="scss"></style>
