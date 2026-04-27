<template>
  <Auth>
    <section>
      <h4 class="font-medium text-[2.125rem] mb-10">
        {{ $t("labels.auth.login.welcomeBack") }}
      </h4>

      <div class="mb-10">
        <div class="flex items-center gap-4 mb-7">
          <span class="w-full h-[2px] bg-[#EEEEEE]"></span>

          <p class="min-w-fit text-[#A5A5A5]">
            {{ $t("labels.auth.login.loginUseing") }}
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
        <VeeForm :initial-values="intialValues" :validation-schema="schema" v-slot="{ values, errors }"
          @submit="submit">
          <div class="flex flex-col gap-8 mb-10">
            <UIText name="email" :placeholder="$t('inputLabels.emailPlaceholder')" :isRequired="true" preIcon="sms-thin"
              :preIconClasses="['text-2xl text-[#333333] !font-normal']" :label="$t('inputLabels.email')" clas />

            <UIText name="password" :isRequired="true" :showVisibility="true" type="password" preIcon="lock"
              :preIconClasses="['text-2xl text-[#333333] !font-normal']" placeholder="12345678"
              :label="$t('inputLabels.password')" />

            <div class="flex items-center justify-between">
              <VeeField name="signSave" v-slot="{ field, meta }">
                <div class="cntr flex gap-2 items-end group w-fit">
                  <input v-bind="field" v-model="values.signSave" type="checkbox" id="cbx" class="hidden-xs-up" />
                  <label for="cbx" class="cbx group-hover:border-[#c57007] checked: transition-colors"></label>
                  <label for="cbx" class="font-medium cursor-pointer group-hover:text-[#c57007] transition-colors">{{
                    $t("labels.auth.login.saveLogin") }}</label>
                </div>
              </VeeField>

              <NuxtLink :to="localePath('/auth/forget-password')" class="font-medium text-primary">{{
                $t("labels.auth.login.forgetPassword") }}</NuxtLink>
            </div>
          </div>

          <div class="flex flex-col w-full gap-6">
            <UIButton type="submit" :loading="isLoading" :classes="[
              'py-4 !px-12 min-w-fit gap-2 border !justify-center bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
            ]" :text="$t('labels.auth.login.login')" />

            <UIButton @click="router.push(localePath('/auth/sign-up'))" type="button" :classes="[
              'py-4 !px-12 font-medium border !justify-center !min-w-fit me-2  gap-2 border-[1px] text-primary   font-meduim hover:text-white border-primary hover:bg-primary',
            ]" :text="$t('labels.auth.login.craeteAnAccount')" />
          </div>
        </VeeForm>
      </div>
    </section>
  </Auth>
</template>

<script setup lang="js">
import { configure } from "vee-validate";
import * as yup from "yup";
import { userStore } from "~/stores/userStore";

const router = useRouter()
const localePath = useLocalePath()
const toast = useNuxtApp().$toast
const { postData } = useApi()
const { getUserData } = userStore()

const isLoading = ref(false)
const { t } = useI18n()

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
  password: yup
    .string()
    .required(t("errors.isRequired", { name: t("inputLabels.password") }))
    .min(8, t("errors.min", { name: t("inputLabels.password"), num: 8 }))
    .matches(/[a-z]/, t("errors.passwordLowercase"))
    .matches(/[A-Z]/, t("errors.passwordUppercase"))
    .matches(/[0-9]/, t("errors.passwordNumber"))
    .matches(/[!@#$%^&*(),.?":{}|<>]/, t("errors.passwordSpecialChar")),
  signSave: yup.boolean(),
});

const intialValues = {
  email: useCookie("sunpyramids-email").value ?? "",
  signSave: useCookie("sunpyramids-email").value ? true : false
}
const socials = [{ img: "google", end: "auth/google/redirect" }, { img: "facebook", end: "auth/facebook/redirect/" }]

const signSocial = (end) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.baseURL;
  if (process.client) window.location.href = `${baseURL}${end}`
}

const submit = async (values) => {
  isLoading.value = true
  const body = {
    email: values.email,
    password: values.password,
  }

  await postData("auth/login", body).then((res) => {
    toast.success(res.message)
    useCookie("sunpyramids-token").value = res.data.accessToken
    useCookie("sunpyramids-user").value = res.data
    getUserData(res.data)
    if (values.signSave) {
      useCookie("sunpyramids-email").value = values.email
    } else {
      useCookie("sunpyramids-email").value = null
    }
    setTimeout(() => {
      router.push(localePath("/"))
    }, 2000);

    isLoading.value = false
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
