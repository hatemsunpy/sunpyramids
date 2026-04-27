<template>
  <div class="xl:px-20 px-4  pt-12 pb-12 gap-10 bg-white">
    <!-- xl:w-[45%] w-full md:w-2/3 -->
    <div
      class="bg-[#f9fafb] rounded-[2rem] mx-auto w-full xl:p-8 px-4 py-6 bg-[url('../../assets/imgs/contactForm.png')] bg-no-repeat bg-contain">
      <VeeForm :validation-schema="schema" v-slot="{ values, errors }" @submit="submit">
        <h4 class="font-medium md:text-4xl text-3xl text-center mb-14">
          {{ $t("labels.makeEasy") }}
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


          <div class="dropzone" @dragover.prevent @dragenter.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop" @click="fileInput.click()"
            :class="{ dragging: isDragging }">
            <input type="file" multiple ref="fileInput" class="hidden" accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
              @change="handleFiles" />

            <p class="text-sm font-medium">
              {{ $t('labels.specialNeed.dragAndDrop') }}
            </p>

            <p class="text-xs text-gray-400 mt-1">
              JPEG, PNG, PDF, DOC, DOCX
            </p>
          </div>

          <div v-if="files.length" class="mt-4 space-y-2">
            <div v-for="(file, index) in files" :key="file.name"
              class="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg">
              <span class="text-sm truncate max-w-[70%]">
                {{ file.name }}
              </span>

              <button @click.stop="removeFile(index)" class="text-red-500 text-xs hover:underline">
                delete
              </button>
            </div>
          </div>

          <UIButton :loading="isLoading" :classes="[
            'py-6 px-[3.5rem] min-w-fit bg-secondary text-center text-base !justify-center text-white font-medium hover:bg-[#c57007] h-full',
          ]" :text="$t('labels.customlinteray')" type="submit" />
        </div>
      </VeeForm>
    </div>

    <!-- <div @click="openLocation(settings.find((option) => option.option_key == 'company_location_url')?.option_value)"
      class="w-full cursor-pointer rounded-[2rem] h-[53.5rem] overflow-hidden">
      <NuxtImg class="w-full h-full  object-cover" src="/images/realLocation.svg" />
    </div> -->
  </div>
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
const files = ref([]);
const isDragging = ref(false);
const fileInput = ref(null);
const phoneRef = ref(null);

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const handleFiles = (e) => {
  addFiles(Array.from(e.target.files));
};

const handleDrop = (e) => {
  isDragging.value = false;
  addFiles(Array.from(e.dataTransfer.files));
};

const addFiles = (newFiles) => {
  const validFiles = newFiles.filter(file =>
    allowedTypes.includes(file.type)
  );

  if (validFiles.length !== newFiles.length) {
    toast.error("Some files were rejected due to unsupported formats.");
  }

  const uniqueFiles = validFiles.filter(
    file => !files.value.some(f => f.name === file.name)
  );

  files.value.push(...uniqueFiles);
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};

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
  const formData = new FormData();

  // const body = {
  //   name: values.name,
  //   phone: phonesLength.value[0].phone_code + values.phone,
  //   country: nationalities.value.find((ele) => ele.id == values.language).name,
  //   subject: "contact-us (special contact from disabled people page)",
  //   message: values.content,
  //   email: values.email,
  //   recaptcha_token: token,
  //   type: "special_contact"
  // }

  formData.append("name", values.name);
  formData.append("phone", phonesLength.value[0].phone_code + values.phone);
  formData.append("country", nationalities.value.find((ele) => ele.id == values.language).name);
  formData.append("subject", "contact-us");
  formData.append("message", values.content);
  formData.append("email", values.email);
  formData.append("recaptcha_token", token);
  formData.append("type", "home_contact");

  files.value.forEach((file, index) => {
    formData.append(`attachments[${index}]`, file);
  });

  await postData('contact-requests', formData, false, true).then((res) => {
    isLoading.value = false;
    actions.resetForm()
    files.value = [];

    router.push(localePath(`/thankful?name=${values.name}`))
  }).catch((err) => {
    isLoading.value = false;
    toast.error(err.data.message)
  })

};
</script>

<style scoped lang="scss">
.dropzone {
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  background: #fafafa;
  transition: all 0.25s ease;
}

.dropzone:hover {
  border-color: #6366f1;
  background: #f5f7ff;
}

.dropzone.dragging {
  border-color: #4f46e5;
  background: #eef2ff;
  transform: scale(1.02);
}
</style>
