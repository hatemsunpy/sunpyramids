<template>
  <section class="py-16 xl:px-20 px-4 md-10">
    <div
      class="md:py-16 py-4 md:px-12 px-4 rounded-[2rem] bg-[url('/images/linearNeedHelp.png')] bg-no-repeat bg-cover bg-center">
      <h3 class="xl:text-5xl md:text-4xl text-3xl text  font-bold text-center text-white mb-12">
        {{ $t("labels.needHelp") }}
      </h3>

      <VeeForm :validation-schema="schema" v-slot="{ values, errors }" @submit="submit">
        <div class="xl:flex grid md:grid-cols-2 grid-cols-1  items-center gap-5  w-full mt-6">
          <div class="w-full">
            <UIText name="name" :dynamicLabel="$t('inputLabels.fullName')" />
          </div>

          <div class="w-full md:col-span-2 col-span-1">
            <UISelect @click="onClickCountries" :items="nationalities.map((ele) => {
              return {
                name: ele.name,
                id: ele.id
              }
            })" title="name" value="id" name="language" :dynamicLabel="$t('inputLabels.nationality')" />
          </div>

          <div class="w-full col-span-1">
            <UIPhone ref="phoneRef" :dynamicLabel="$t(`inputLabels.phone`)" name="phone" :errors="errors" index="0"
              @changePhoneLength="changePhoneLength" />
          </div>

          <UIButton :classes="[
            'py-6 px-[3.5rem] md:col-span-2 col-span-1 !justify-center min-w-fit bg-secondary text-white font-medium hover:bg-[#c57007] h-full',
          ]" :text="$t('labels.contactNow')" type="submit" />
        </div>
      </VeeForm>
    </div>
  </section>
</template>

<script setup lang="js">
import { configure } from "vee-validate";
import * as yup from "yup";
import { storeToRefs } from 'pinia'
import { sharedStore } from '~/stores/sharedStore.js'

const { nationalities } = storeToRefs(sharedStore())
const { postData } = useApi()
const toast = useNuxtApp().$toast
const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()

let phonesLength = ref({});
const phoneRef = ref(null);


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
});

const onClickCountries = (e) => {
  phoneRef.value.updatePhoneLength(e)
}

function changePhoneLength({ index, length }) {
  phonesLength.value[index] = length;
}

const submit = async (values, actions) => {
  const randomEmail = `${Date.now()}.random@${Math.abs(Math.random * 1000)}test.com`
  const token = await generateRecaptchaToken('6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn', 'submit');
  const body = {
    name: values.name,
    phone: phonesLength.value[0].phone_code + values.phone,
    country: nationalities.value.find((ele) => ele.id == values.language).name,
    subject: `Need help to Finding my Trip`,
    message: `Need help to Finding my Trip`,
    email: randomEmail,
    recaptcha_token: token,
    type: "home_contact"
  }


  await postData('contact-requests', body).then((res) => {
    // toast.success(res.message)
    actions.resetForm()
    router.push(localePath(`/thankful?name=${values.name}`))
  }).catch((err) => {
    toast.error(err.data.message)
  })

};
</script>

<style scoped lang="scss"></style>
