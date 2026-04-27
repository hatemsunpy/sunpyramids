<template>
  <VeeForm :validation-schema="schema" v-slot="{ values, errors }" :initial-values="props.initialValues.personalInfo"
    @submit="submit">
    <div class="grid grid-cols-2 gap-5 pb-24 md:pb-0">
      <div class="w-full col-span-2 grid grid-cols-2 gap-5 gap-y-8">
        <div class="flex col-span-2 gap-5 lg:flex-row flex-col">
          <UIText :isRequired="true" :label="$t('inputLabels.fullName')" :title="$t('inputLabels.fullName')"
            :placeholder="$t('inputLabels.fullNamePlaceholder')" name="fullName" />

          <UIText :isRequired="true" :label="$t('inputLabels.email')" :title="$t('inputLabels.email')"
            :placeholder="$t('inputLabels.emailPlaceholder')" name="email" />
        </div>

        <div class="col-span-2">
          <VeeField name="flightOffer" v-slot="{ field, meta }">
            <div class="cntr flex gap-2 items-end group w-fit">
              <input v-bind="field" v-model="values.flightOffer" type="checkbox" id="cbx" class="hidden-xs-up" />
              <label for="cbx" class="cbx group-hover:border-[#c57007] checked: transition-colors"></label>
              <label for="cbx" class="font-medium text-xl cursor-pointer group-hover:text-[#c57007] transition-colors"
                :class="[values.flightOffer ? 'text-secondary' : '']">{{ $t("inputLabels.addFlightOffer") }}</label>
            </div>
          </VeeField>
        </div>

        <div class="flex col-span-2 gap-5 lg:flex-row flex-col">
          <UISelect @click="onClickCountries" :isRequired="true" :items="nationalities" title="name" value="id" name="nationality"
            :placeholder="$t('inputLabels.nationalityPlaceholder')" :label="$t('inputLabels.nationality')" />

          <div class="w-full">
            <UIPhone ref="phoneRef" :isRequired="true" :title="$t(`inputLabels.phone`)"
              :placeholder="$t(`inputLabels.phonePlaceholder`)" name="phone" :errors="errors" index="0"
              @changePhoneLength="changePhoneLength" />
          </div>
        </div>


        <div class="col-span-2 md:h-[2px] h-2 -mx-4  md:bg-[#F9FAFB] bg-[#eeeeee]"></div>

        <div class="col-span-2 grid  lg:grid-cols-3 gap-5">
          <UICounter :title="$t('inputLabels.adults') + ' (12+)'" name="adult" />

          <UICounter :title="$t('inputLabels.children') + ' (3 - 11)'" name="children" />

          <UICounter :title="$t('inputLabels.infants') + ' (0 - 2)'" name="infants" />
        </div>

        <div class="col-span-2 md:h-[2px] h-2 -mx-4  md:bg-[#F9FAFB] bg-[#eeeeee]"></div>

        <div class="col-span-2">
          <UIRange :title="$t('inputLabels.price')" minName="min" maxName="max" />
        </div>

        <div class="col-span-2 md:h-[2px] h-2 -mx-4  md:bg-[#F9FAFB] bg-[#eeeeee]"></div>

        <div class="col-span-2">
          <UITexterea name="note" :placeholder="$t('inputLabels.notePlaceholder')" :title="$t('inputLabels.note')"
            :label="$t('inputLabels.note')" :row="4" />
        </div>
      </div>

      <div class="col-span-2 md:flex hidden justify-end w-full">
        <UIButton type="submit" :loading="isLoading" :classes="[
          'py-6 !px-12 min-w-fit gap-2 border bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
        ]"  :text="$t('labels.submit')" />
      </div>

      <div class="md:hidden submitBoxShadow block z-20 fixed w-full bg-[#ffffff] p-4 bottom-0  start-0 ">
        <UIButton type="submit" :loading="isLoading" :classes="[
          'py-6 !px-12  gap-2 border bg-primary flex !gap-2 !justify-center  !min-w-full border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
        ]"  :text="$t('labels.submit')" />
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="js">
import { configure } from "vee-validate";
import * as yup from "yup";

const props = defineProps({
  initialValues: {
    type: Object,
    required: true
  },
  nationalities: {
    type: Array,
    required: true
  }
})

const emits = defineEmits(['submitForm'])

const { t } = useI18n();
let phonesLength = ref({});
const nationalities = ref([])
const phoneRef = ref(null);
const isLoading = ref(false)

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});


const schema = yup.object().shape({
  fullName: yup
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
  flightOffer: yup.boolean(),
  adult: yup.number().min(1, t("errors.min", { name: t("inputLabels.adults"), num: 1 })).required(),
  children: yup.string(),
  infants: yup.string(),
  min: yup.number().required(),
  max: yup.number().required(),
  note: yup.string(),
});

watch(() => props.nationalities, (newVal) => {
  nationalities.value = newVal
}, {
  immediate: true
})


const onClickCountries = (e) => {
  phoneRef.value.updatePhoneLength(e)
}

function changePhoneLength({ index, length }) {
  phonesLength.value[index] = length;
}

const submit = (values) => {
  values["phone"] = phonesLength.value[0].phone_code + values.phone
  isLoading.value = true
  emits('submitForm', values, 2)
};
</script>

<style scoped lang="scss">
/* From Uiverse.io by cssbuttons-io */
.cbx {
  position: relative;
  top: 1px;
  width: 28px;
  height: 28px;
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
  top: 3px;
  left: 9px;
  width: 7px;
  height: 14px;
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
