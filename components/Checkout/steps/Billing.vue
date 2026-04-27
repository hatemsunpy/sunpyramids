<template>
  <div class="grid grid-cols-3 gap-6 mt-6">
    <div class="lg:col-span-2 col-span-3 flex flex-col gap-6">

      <div class="lg:p-10 p-4 py-6 bg-white lg:rounded-2xl">
        <VeeForm :validation-schema="schema" v-slot="{ values, errors }" @submit="submit">

          <div class="flex flex-wrap lg:flex-nowrap items-center gap-5 mb-6">
            <UIText :label="$t('inputLabels.fullName')" :title="$t('inputLabels.fullName')"
              :placeholder="$t('inputLabels.fullNamePlaceholder')" name="name" />
            <UISelect @click="onClickCountries" :items="nationalities.map((ele) => {
              return {
                name: ele.name,
                id: ele.id
              }
            })" title="name" value="id" name="nationality" :placeholder="$t('inputLabels.nationalityPlaceholder')"
              :label="$t('inputLabels.nationality')" />
          </div>

          <div class="flex items-center flex-wrap lg:flex-nowrap gap-5">
            <div class="w-full">
              <UIPhone ref="phoneRef" :title="$t(`inputLabels.phone`)" :placeholder="$t(`inputLabels.phonePlaceholder`)" name="phone"
                :errors="errors" index="0" @changePhoneLength="changePhoneLength" />
            </div>

            <UIText :label="$t('inputLabels.email')" :title="$t('inputLabels.email')"
              :placeholder="$t('inputLabels.emailPlaceholder')" name="email" />
          </div>

          <div class="col-span-2 h-[2px] bg-[#F9FAFB] my-6"></div>

          <div class="flex items-center flex-wrap lg:flex-nowrap gap-5">
            <UISelect :items="nationalities.map((ele) => {
              return {
                name: ele.name,
                id: ele.id
              }
            })" title="name" value="id" name="country" :placeholder="$t('inputLabels.countryPlaceholder')"
              :label="$t('inputLabels.country')" />

            <UIText :title="$t('inputLabels.statePlaceholder')" name="state" :label="$t('inputLabels.state')"
              :placeholder="$t('inputLabels.statePlaceholder')" />
          </div>

          <div class="col-span-2 h-[2px] bg-[#F9FAFB] my-6"></div>


          <UIText :title="$t('labels.picUpLocation')" name="locationUp" :placeholder="$t('labels.locationPlaceholder')"
            :label="$t('labels.picUpLocation')" />

          <div class="mt-8">
            <UITexterea :isOptional="true" name="note" :placeholder="$t('inputLabels.notePlaceholder')"
              :title="$t('inputLabels.notePayment')" :label="$t('inputLabels.notePayment')" :row="4" />
          </div>

          <div class="mt-8 lg:flex hidden justify-end w-full gap-8">
            <UIButton @click="router.push(localePath('/'))" type="button" :classes="[
              'py-4 !px-12 font-medium border !min-w-fit me-2  gap-2 border-[1px] text-textDark   font-meduim hover:text-white border-textLight hover:bg-textDark',
            ]" :text="$t('labels.cancel')" />


            <UIButton :loading="isLoadingBtn" type="submit" :classes="[
              'py-4 !px-12 min-w-fit gap-2 border bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
            ]" :text="$t('inputLabels.applyForPayment')" />
          </div>

          <div
            class="mt-8 lg:relative p-4 bg-white submitBoxShadow  fixed bottom-0 left-0 lg:hidden   flex justify-end w-full gap-4">
            <UIButton @click="router.push(localePath('/'))" type="button" :classes="[
              'py-4 !px-12 w-full !justify-center font-medium border !min-w-fit me-2  gap-2 border-[1px] text-textDark   font-meduim hover:text-white border-textLight hover:bg-textDark',
            ]" :text="$t('labels.cancel')" />


            <UIButton :loading="isLoadingBtn" type="submit" :classes="[
              'py-4 !px-12 min-w-fit !justify-center w-full gap-2 border bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
            ]" :text="$t('inputLabels.applyForPayment')" />
          </div>
        </VeeForm>
      </div>
    </div>

    <CheckoutSummary />
  </div>
</template>

<script setup lang='js'>
import { configure } from "vee-validate";
import * as yup from "yup";
import { storeToRefs } from 'pinia'
import { sharedStore } from '~/stores/sharedStore.js'

const router = useRouter();
const localePath = useLocalePath();
const { nationalities } = storeToRefs(sharedStore())
const { t } = useI18n()
const phoneRef = ref(null);

const emits = defineEmits(["updateData"])
let phonesLength = ref({});
const isLoadingBtn = ref(false);
function changePhoneLength({ index, length }) {
  phonesLength.value[index] = length;
}
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
  , phone: yup.string().required(t("errors.isRequired", { name: t("inputLabels.phone") })).test((value, ctx) => {
    if (value.length == phonesLength.value[0].length) {
      return true;
    } else {
      return ctx.createError({
        message: t("errors.phoneLength", {
          name: t("inputLabels.phone"),
          num: phonesLength.value[0].length,
        }),
      });
    }
  })
  ,
  nationality: yup.string().required(t("errors.isRequired", { name: t("inputLabels.nationality") })),
  country: yup.string().required(t("errors.isRequired", { name: t("inputLabels.country") })),
  state: yup.string().required(t("errors.isRequired", { name: t("inputLabels.state") })),
  locationUp: yup.string().required(t("errors.isRequired", { name: t("labels.picUpLocation") })),
  note: yup.string(),
});

const submit = (values) => {
  emits("updateData", {
    fullName: values.name,
    email: values.email,
    phone: phonesLength.value[0].phone_code + values.phone,
    nationality: nationalities.value.find((ele) => ele.id == values.nationality).name,
    country: nationalities.value.find((ele) => ele.id == values.country).name,
    state: values.state,
    locationUp: values.locationUp,
    note: values.note ?? ""
  })
}

const onClickCountries = (e) => {
  phoneRef.value.updatePhoneLength(e)
}
</script>

<style scoped lang='scss'>
.radio-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.075s ease-in-out;
}

.radio-button input[type="radio"] {
  display: none;
}

.radio-checkmark {
  display: inline-block;
  position: relative;
  min-width: 24px;
  min-height: 24px;
  border: 2px solid;
  border-radius: 50%;
  @apply border-[#A5A5A5];
}

.radio-checkmark:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  min-width: 16px;
  min-height: 16px;
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
  @apply bg-primary;
}

.radio-button input[type="radio"]:checked~.radio-checkmark:before {
  transform: translate(-50%, -50%) scale(1);
}

.radio-button input[type="radio"]:checked~.radio-checkmark {
  @apply border-primary;
}
</style>