<template>
  <div class="w-full  bg-white boxShadowRightPanal  mt-8   rounded-b-lg ">
    <div class="bg-primary p-[6px] text-center rounded-t-xl">
      <h3 class="font-medium text-lg text-white">{{ $t("labels.event.bookTicket") }}</h3>
    </div>


    <VeeForm :validation-schema="schema" v-slot="{ values, errors }" @submit="submit">
      <div class="flex flex-col gap-6 px-4 py-4">
        <UIText name="name" :dynamicLabel="$t('inputLabels.fullName')" />

        <UISelect @click="onClickCountries" :items="nationalities.map((ele) => {
          return {
            name: ele.name,
            id: ele.id
          }
        })" title="name" value="id" name="language" :dynamicLabel="$t('inputLabels.nationality')" />

        <UIPhone ref="phoneRef" :dynamicLabel="$t(`inputLabels.phone`)" name="phone" :errors="errors" index="0"
          @changePhoneLength="changePhoneLength" />

        <UIText name="email" :dynamicLabel="$t('inputLabels.email')" />

        <UITexterea name="content" :row="8" :dynamicLabel="$t('inputLabels.writeus')" />

        <UIButton :loading="isLoading" :classes="[
          'py-4  px-[3.5rem] min-w-fit bg-primary text-center text-base !justify-center text-white font-medium hover:bg-[#143485]   h-full',
        ]" :text="$t('labels.customlinteray')" type="submit" />
      </div>
    </VeeForm>

  </div>
</template>

<script setup lang='js'>
import { configure } from "vee-validate";
import * as yup from "yup";
import { storeToRefs } from 'pinia'
import { sharedStore } from '~/stores/sharedStore.js'



const { nationalities } = storeToRefs(sharedStore())
const { postData } = useApi()
const toast = useNuxtApp().$toast

let phonesLength = ref({});
const { t } = useI18n()
const phoneRef = ref(null);
const router = useRouter()
const localePath = useLocalePath()

const props = defineProps({
  title: {
    required: true,
    type: String
  }
})

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
  phone: yup.string().required(t("errors.isRequired", { name: t("inputLabels.phone") }))
    .test((value, ctx) => {
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
  language: yup.string().required(t("errors.isRequired", { name: t("inputLabels.nationality") })),
  email: yup
    .string().email(t("errors.email", { name: t("inputLabels.email") }))
    .required(t("errors.isRequired", { name: t("inputLabels.email") }))
  ,
  content: yup.string().required(t("errors.isRequired", { name: t("inputLabels.writeus") })),
});

const isLoading = ref(false);

function changePhoneLength({ index, length }) {
  phonesLength.value[index] = length;
}

const onClickCountries = (e) => {
  phoneRef.value.updatePhoneLength(e)
}

const submit = async (values, actions) => {
  isLoading.value = true;
  const token = await generateRecaptchaToken('6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn', 'submit');
  const body = {
    name: values.name,
    phone: phonesLength.value[0].phone_code + values.phone,
    country: nationalities.value.find((ele) => ele.id == values.language).name,
    subject: `contact us from event (${props.title})`,
    message: values.content,
    email: values.email,
    recaptcha_token: token,
    type: "event_contact"
  }



  await postData('contact-requests', body).then((res) => {
    isLoading.value = false;
    // toast.success(res.message)
    actions.resetForm()
    router.push(localePath(`/thankful?name=${values.name}`))
  }).catch((err) => {
    isLoading.value = false;
    toast.error(err.data.message)
  })

};

</script>

<style scoped lang='scss'>
.boxShadowRightPanal {
  box-shadow: 0px 8px 24px #00000014;
}
</style>