<template>
  <div class="w-full">
    <h1 class="text-[#666666] text-xl font-medium mb-4">{{ $t('labels.myProfile') }}</h1>

    <VeeForm :validation-schema="schemaSettings" v-slot="{ values, errors }" @submit="submit"
      :initial-values="intialData">
      <div class="w-full grid lg:grid-cols-2 grid-cols-1 gap-6 px-5 py-6 rounded-3xl bg-white">

        <div class="lg:col-span-2 col-span-1">
          <UIText :isRequired="true" :label="$t('inputLabels.fullName')" :title="$t('inputLabels.fullName')"
            :placeholder="$t('inputLabels.fullNamePlaceholder')" name="fullName" />
        </div>

        <UIText :isRequired="true" :label="$t('inputLabels.email')" :title="$t('inputLabels.email')"
          :placeholder="$t('inputLabels.emailPlaceholder')" name="email" />

        <UIText type='number' :isRequired="true" :label="$t('inputLabels.phone')" :title="$t(`inputLabels.phone`)"
          placeholder="+201XXXXXXXXXX" name="phone" />
        <!-- <UIPhone :isRequired="true" :title="$t(`inputLabels.phone`)" :placeholder="$t(`inputLabels.phonePlaceholder`)"
          name="phone" :errors="errors" index="0" @changePhoneLength="changePhoneLength" /> -->

        <UIDate name="birthDate" :title="$t('inputLabels.birthDate')"
          :placeholder="$t('inputLabels.birthDatePlaceholder')" label="inputLabels.birthDate"
          :maxDate="new Date(Date.now() - 86400000)" :minDate="null" icon="calender" />

        <UISelect :items="nationalities" title="name" value="name" name="nationality"
          :placeholder="$t('inputLabels.nationalityPlaceholder')" :label="$t('inputLabels.nationality')" />

        <UIText name="password" :isRequired="true" :showVisibility="true" type="password" preIcon="lock"
          :preIconClasses="['text-2xl text-[#333333] !font-normal']" :label="$t('inputLabels.password')"
          placeholder="12345678" />

        <UIText name="confirmPassword" :isRequired="true" :showVisibility="true" type="password" preIcon="lock"
          :preIconClasses="['text-2xl text-[#333333] !font-normal']" :label="$t('inputLabels.confirmPassword')"
          placeholder="12345678" />
      </div>

      <div class="col-span-2 md:flex hidden mt-6  justify-end w-full gap-8">
        <UIButton @click="router.push(localePath('/'))" type="button" :classes="[
          'py-4 !px-12 font-medium border !min-w-fit me-2  gap-2 border-[1px] text-textDark   font-meduim hover:text-white border-textLight hover:bg-textDark',
        ]" :text="$t('labels.cancel')" />
        <UIButton :loading="isLoading" type="submit" :classes="[
          'py-4 !px-12 min-w-fit gap-2 border bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
        ]" :text="$t('labels.saveChanges')" />
      </div>

      <div class="md:hidden submitBoxShadow submitBoxShadow flex z-20 fixed w-full bg-[#ffffff] p-4 bottom-0  start-0 ">
        <UIButton @click="router.push(localePath('/'))" type="button" :classes="[
          'py-4 !px-12 font-medium border !w-full me-2 !justify-center  gap-2 border-[1px] text-textDark   font-meduim hover:text-white border-textLight hover:bg-textDark',
        ]" :text="$t('labels.cancel')" />

        <UIButton :loading="isLoading" type="submit" :classes="[
          'py-4 !px-12 min-w-fit gap-2 !w-full border !justify-center bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
        ]" :text="$t('labels.saveChanges')" />
      </div>
    </VeeForm>
  </div>

  <SharedBottomBar />
</template>

<script setup lang='js'>
import { configure } from "vee-validate";
import * as yup from "yup";
import { storeToRefs } from 'pinia'
import { sharedStore } from '~/stores/sharedStore.js'


const router = useRouter()
const localePath = useLocalePath()
const { nationalities } = storeToRefs(sharedStore())
const { patchData } = useApi()
const userData = useCookie('sunpyramids-user').value
const toast = useNuxtApp().$toast

const { t } = useI18n();
let phonesLength = ref({});
const intialData = ref({
  fullName: userData.name,
  email: userData.email,
  phone: userData.phone,
  nationality: "Egypt",
  birthDate: userData.birthdate
})

const isLoading = ref(false);

watch(nationalities, (newValue) => {
  if (newValue.length > 0) {
    intialData.value = userData.nationality ? nationalities.value.find((n) => n.name == userData.nationality).id : null
  }
})

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

function changePhoneLength({ index, length }) {
  phonesLength.value[index] = length;
}

const schemaSettings = yup.object().shape({
  fullName: yup
    .string()
    .required(t("errors.isRequired", { name: t("inputLabels.fullName") })).matches(
      /^[^\d]*$/,
      t("errors.invalidCharacters", { name: t("inputLabels.fullName") }) // Customize this message
    ),
  email: yup
    .string().email(t("errors.email", { name: t("inputLabels.email") }))
    .required(t("errors.isRequired", { name: t("inputLabels.email") }))
  , phone: yup.number().required(t("errors.isRequired", { name: t("inputLabels.phone") }))
  // .test((value, ctx) => {
  //   if (value.length == phonesLength.value[0].length) {
  //     return true;
  //   } else {
  //     return ctx.createError({
  //       message: t("errors.phoneLength", {
  //         name: t("inputLabels.phone"),
  //         num: phonesLength.value[0].length,
  //       }),
  //     });
  //   }
  // })
  ,
  nationality: yup.string().nullable(),
  birthDate: yup.date().nullable(),
  password: yup
    .string()
    .min(8, t("errors.min", { name: t("inputLabels.password"), num: 8 })).matches(/[a-z]/, t("errors.passwordLowercase"))
    .matches(/[A-Z]/, t("errors.passwordUppercase"))
    .matches(/[0-9]/, t("errors.passwordNumber"))
    .matches(/[!@#$%^&*(),.?":{}|<>]/, t("errors.passwordSpecialChar")),
  confirmPassword: yup
    .string()
    .min(8)
    .oneOf([yup.ref("password")], t("errors.match", { name: t("inputLabels.confirmPassword"), nameTwo: t("inputLabels.password") })).when("password", {
      is: (value) => !!value && value.length > 0,
      then: (schema) =>
        schema.required(t("errors.isRequired", { name: t("inputLabels.confirmPassword") })),
      otherwise: (schema) => schema.notRequired(),
    }),
});

function formatDateToYMD(dateInput) {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


const submit = async (values) => {
  isLoading.value = true;
  const { accessToken, ...data } = userData;
  const body = {
    ...data,
    password: null,
    password_confirmation: null
  }
  if (values.fullName) {
    body.name = values.fullName
  }
  if (values.email) {
    body.email = values.email
  }
  if (values.phone) {
    body.phone = `${values.phone}`
  }
  if (values.nationality) {
    body.nationality = values.nationality
  }
  if (values.birthDate) {
    body.birthdate = formatDateToYMD(values.birthDate)
  }
  if (values.password) {
    body.password = values.password
    body.password_confirmation = values.confirmPassword
  }

  await patchData('profile', body).then(res => {
    let newData = body
    toast.success(t('Profile updated successfully'));
    if (values.password) {
      const { password, password_confirmation, ...thisData } = body
      newData = thisData
    }
    if (values.birthDate) {
      newData.birthdate = values.birthDate
    }

    isLoading.value = false;

    useCookie('sunpyramids-user').value = newData
  }).catch(err => {
    console.error(err);
    toast.error(err.data.message);
    isLoading.value = false;
  });
}
</script>

<style scoped lang='scss'></style>