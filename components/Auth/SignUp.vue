<template>
  <Auth>
    <section>
      <h4 class="font-medium text-[2.125rem] mb-10">
        {{ $t("labels.auth.signup.createNewAccount") }}
      </h4>

      <div class="mb-10">
        <div class="flex items-center gap-4 mb-7">
          <span class="w-full h-[2px] bg-[#EEEEEE]"></span>

          <p class="min-w-fit text-[#A5A5A5]">
            {{ $t("labels.auth.signup.createUsing") }}
          </p>

          <span class="w-full h-[2px] bg-[#EEEEEE]"></span>
        </div>

        <div class="flex items-center gap-4 justify-between">
          <button v-for="(item, index) in socials" :key="index" @click="signSocial(item.end)"
            class="flex gap-2 py-4 w-full items-center justify-center border border-[#EEEEEE] rounded-2xl">
            <NuxtImg :src="`/icons/${item.img}.png`" class="min-h-6 min-w-6" />
          </button>
        </div>
      </div>

      <div class="">
        <VeeForm :validation-schema="schema" v-slot="{ values, errors }" @submit="submit">
          <div class="flex flex-col gap-8 mb-10">
            <UIText name="name" :isRequired="true" preIcon="profile"
              :preIconClasses="['text-2xl text-[#333333] !font-normal']" :label="$t('inputLabels.fullName')"
              :placeholder="$t('inputLabels.fullNamePlaceholder')" />

            <UIText name="email" :isRequired="true" preIcon="sms-thin"
              :preIconClasses="['text-2xl text-[#333333] !font-normal']" :label="$t('inputLabels.email')"
              :placeholder="$t('inputLabels.emailPlaceholder')" />

            <UIText name="password" :isRequired="true" :showVisibility="true" type="password" preIcon="lock"
              :preIconClasses="['text-2xl text-[#333333] !font-normal']" :label="$t('inputLabels.password')"
              placeholder="12345678" />

            <UIText name="confirmPassword" :isRequired="true" :showVisibility="true" type="password" preIcon="lock"
              :preIconClasses="['text-2xl text-[#333333] !font-normal']" :label="$t('inputLabels.confirmPassword')"
              placeholder="12345678" />

            <div class="flex items-center justify-between">
              <VeeField name="agreeTerms" v-slot="{ field, meta }">
                <div class="flex items-center gap-1">
                  <div class="cntr flex gap-2 items-end group w-fit">
                    <input v-bind="field" v-model="values.agreeTerms" type="checkbox" id="cbx" class="hidden-xs-up" />
                    <label for="cbx" class="cbx group-hover:border-[#c57007] checked: transition-colors"></label>
                    <label for="cbx" class="font-medium cursor-pointer group-hover:text-[#c57007] transition-colors">{{
                      $t("labels.auth.signup.iAgree") }}</label>
                  </div>

                  <NuxtLink class="text-primary font-medium underline" :to="localePath('terms-and-conditions')">{{
                    $t("labels.auth.signup.termsAndConditions")
                  }}</NuxtLink>
                </div>
              </VeeField>
            </div>
          </div>

          <div class="flex flex-col w-full gap-6">
            <UIButton type="submit" :loading="isLoading" :classes="[
              'py-4 !px-12 min-w-fit gap-2 border !justify-center bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
            ]" :text="$t('labels.auth.login.craeteAnAccount')" :disabled="!values.agreeTerms" />

            <div class="flex items-center justify-center font-medium gap-1 leading-[19.17px]">
              <p>{{ $t("labels.auth.signup.iamAlready") }}</p>
              <NuxtLink class="text-secondary" :to="localePath('/auth/sign-in')">{{ $t("labels.auth.signup.login") }}
              </NuxtLink>
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

const isLoading = ref(false)
const { t } = useI18n()


configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const schema = yup.object().shape({
  name: yup
    .string()
    .required(t("errors.isRequired", { name: t("inputLabels.fullName") })).matches(
      /^[^\d]*$/,
      t("errors.invalidCharacters", { name: t("inputLabels.fullName") }) // Customize this message
    ),
  email: yup
    .string().email(t("errors.email", { name: t("inputLabels.email") }))
    .required(t("errors.isRequired", { name: t("inputLabels.email") }))
  ,
  password: yup
    .string()
    .required(t("errors.isRequired", { name: t("inputLabels.password") }))
    .min(8, t("errors.min", { name: t("inputLabels.password"), num: 8 })).matches(/[a-z]/, t("errors.passwordLowercase"))
    .matches(/[A-Z]/, t("errors.passwordUppercase"))
    .matches(/[0-9]/, t("errors.passwordNumber"))
    .matches(/[!@#$%^&*(),.?":{}|<>]/, t("errors.passwordSpecialChar")),
  agreeTerms: yup.boolean().required(),
  confirmPassword: yup
    .string()
    .required(t("errors.isRequired", { name: t("inputLabels.confirmPassword") }))
    .min(8)
    .oneOf([yup.ref("password")], t("errors.match", { name: t("inputLabels.confirmPassword"), nameTwo: t("inputLabels.password") })),
});
const socials = [{ img: "google", end: "auth/google/redirect" }, { img: "facebook", end: "auth/facebook/redirect/" }]

const signSocial = (end) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.baseURL;
  if (process.client) window.location.href = `${baseURL}${end}`
}

const submit = async (values) => {
  isLoading.value = true
  const body = {
    name: values.name,
    email: values.email,
    password: values.password,
    password_confirmation: values.confirmPassword
  }

  await postData("auth/register", body).then((res) => {
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

<style scoped lang="scss">
/* From Uiverse.io by cssbuttons-io */
.cbx {
  position: relative;
  top: 1px;
  width: 24px;
  height: 24px;
  border: 2px solid #a5a5a5;
  border-radius: 0.6125rem;
  vertical-align: middle;
  cursor: pointer;
  display: block;
}

.cbx:hover {
  border-color: #c57007;
}

.cbx:after {
  content: "";
  position: absolute;
  top: 2px;
  left: 7px;
  width: 6px;
  height: 12px;
  opacity: 0;
  transform: rotate(45deg) scale(0);
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}

.lbl {
  margin-left: 5px;
  vertical-align: middle;
  cursor: pointer;
}

#cbx:checked~.cbx {
  border-color: transparent;
  background: #f7951d;

  &:hover {
    background-color: #c57007;
    transition: all 0.1s ease;
  }

  @apply group-hover:bg-[#c57007];
}

#cbx:checked~.cbx:after {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.cntr {
  position: relative;
}

.hidden-xs-up {
  display: none !important;
}
</style>
