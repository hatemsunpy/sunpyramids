<template>
  <section class="xl:px-20 px-4 flex flex-col lg:flex-row gap-10">
    <div
      class="bg-[#f9fafb] rounded-[2rem] w-full xl:p-8 px-4 py-6 bg-[url('../../assets/imgs/contactForm.png')] bg-no-repeat bg-contain">
      <VeeForm :validation-schema="schema" v-slot="{ values, errors }" @submit="submit">
        <h4 class="font-medium md:text-4xl text-3xl text-center mb-14">
          {{ $t("labels.contactus.form.contactToday") }}
        </h4>

        <div class="flex flex-col gap-6">
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
            'py-6 px-[3.5rem] min-w-fit bg-secondary text-center text-base !justify-center text-white font-medium hover:bg-[#c57007] h-full',
          ]" :text="$t('inputLabels.sendAMessage')" type="submit" />
        </div>
      </VeeForm>
    </div>

    <div class="w-full rounded-[2rem] h-[53.5rem] overflow-hidden">
      <!-- <NuxtImg class="w-full h-full  object-cover" src="/images/realLocation.svg" /> -->
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.6362016367007!2d31.1358037!3d29.989883499999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458453ac9012d27%3A0xc9798c397d0dfd0!2sSUN%20PYRAMIDS%20TOURS!5e0!3m2!1sen!2seg!4v1756828808951!5m2!1sen!2seg"
        style="border:0; width: 100%; height: 100%; " allowfullscreen="" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </section>
  <!-- @click="openLocation(settings.find((option) => option.option_key == 'company_location_url')?.option_value)" -->
</template>

<script setup lang="js">
import { configure } from "vee-validate";
import * as yup from "yup";
import { storeToRefs } from 'pinia'
import { sharedStore } from '~/stores/sharedStore.js'



const { nationalities, settings } = storeToRefs(sharedStore())
const { postData } = useApi()
const toast = useNuxtApp().$toast

let phonesLength = ref({});
const { t } = useI18n()
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
  email: yup
    .string().email(t("errors.email", { name: t("inputLabels.email") }))
    .required(t("errors.isRequired", { name: t("inputLabels.email") }))
  ,
  content: yup.string().required(t("errors.isRequired", { name: t("inputLabels.writeus") })),
});

const openLocation = (url) => {
  window.open(url[0], "_blank")
}

const onClickCountries = (e) => {
  phoneRef.value.updatePhoneLength(e)
}


const isLoading = ref(false);

function changePhoneLength({ index, length }) {
  phonesLength.value[index] = length;
}

const router = useRouter()
const localePath = useLocalePath()

const submit = async (values, actions) => {
  isLoading.value = true;
  const token = await generateRecaptchaToken('6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn', 'submit');
  const body = {
    name: values.name,
    phone: phonesLength.value[0].phone_code + values.phone,
    country: nationalities.value.find((ele) => ele.id == values.language).name,
    subject: "contact-us",
    message: values.content,
    email: values.email,
    recaptcha_token: token,
    type: "form_contact"
  }



  await postData('contact-requests', body).then((res) => {
    isLoading.value = false;
    actions.resetForm()
    router.push(localePath(`/thankful?name=${values.name}`))
  }).catch((err) => {
    isLoading.value = false;
    toast.error(err.data.message)
  })

};
</script>

<style scoped lang="scss"></style>
