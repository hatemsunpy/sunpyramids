<template>
  <VeeForm :validation-schema="schema" v-slot="{ values, errors }" :initial-values="props.initialValues.quickInfo"
    @submit="submit">
    <div class="grid grid-cols-2 gap-5 pb-24 md:pb-0">
      <div class="w-full col-span-2">
        <div class="w-full flex lg:flex-row flex-col lg:items-center items-start lg:gap-14 gap-6">
          <h6 class="text-xl font-medium text-textLight min-w-fit">
            {{ $t("labels.whenBeTravelling") }}
          </h6>

          <div class="flex md:flex-row flex-col lg:items-center items-start md:gap-12 gap-3 w-full justify-start">
            <UIRadio v-for="option in thisOptions" :title="$t(`labels.${option}`)" :value="option" name="type" />
          </div>
        </div>

        <ClientOnly>
          <div class="flex items-center gap-4 md:flex-nowrap  flex-wrap w-full mt-8">
            <UIDate v-if="values.type == 'existTime'" name="fromDate" :title="$t('labels.from')"
              :placeholder="$t('labels.selectStartDate')" label="inputLabels.Date" :maxDate="values.toDate"
              icon="calender" />

            <UIDate v-if="values.type == 'existTime'" name="toDate" :title="$t('labels.to')"
              :placeholder="$t('labels.selectEndDate')" label="inputLabels.Date" icon="calender"
              :minDate="values.fromDate" />

            <UIDate v-if="values.type == 'approximateTime'" name="month" :title="$t('labels.selectMonth')"
              :placeholder="$t('labels.selectExpectedMonth')" label="inputLabels.month" icon="calender"
              :isMonth="true" />
            <UIText v-if="values.type == 'notSureYet'" :placeholder="$t('inputLabels.numberOfDays')"
              :title="$t('labels.manyDays')" :label="$t('labels.manyDays')" type="number" name="days" />
          </div>
        </ClientOnly>
      </div>

      <div class="col-span-2 md:flex hidden justify-end w-full">
        <UIButton type="submit" :classes="[
          'py-6 !px-12 min-w-fit gap-2 border bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
        ]" postIcon="full-arrow-right" :postIconClasses="['text-2xl mb-0 w-6 h-6']" :text="$t('labels.nextUp')" />
      </div>

      <div class="md:hidden block z-20 fixed w-full bg-[#ffffff] p-4 bottom-0  start-0 ">
        <UIButton type="submit" :classes="[
          'py-6 !px-12  gap-2 border bg-primary flex !gap-2 !justify-center  !min-w-full border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
        ]" postIcon="full-arrow-right" :postIconClasses="['text-2xl mb-0 w-6 h-6']" :text="$t('labels.nextUp')" />
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
  }
})
const emits = defineEmits(['submitForm'])

const { t } = useI18n();


const thisOptions = ["existTime", "approximateTime", "notSureYet",]

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const schema = yup.object().shape({
  type: yup.string().required(),
  fromDate: yup.date().nullable().when("type", {
    is: "existTime",
    then: (schema) => schema.required(t("errors.isRequired", { name: t("inputLabels.Date") })),
    otherwise: (schema) => schema.nullable(),
  }),
  toDate: yup.date().nullable().when("type", {
    is: "existTime",
    then: (schema) => schema.required(t("errors.isRequired", { name: t("inputLabels.Date") })),
    otherwise: (schema) => schema.nullable(),
  }),
  month: yup.object().nullable().when("type", {
    is: "approximateTime",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.nullable(),
  }),
  days: yup.string().nullable().when("type", {
    is: "notSureYet",
    then: (schema) =>
      schema.required(t("errors.isRequired", { name: t("inputLabels.numberOfDays") })),
    otherwise: (schema) => schema.nullable(),
  }),
});


const submit = (values) => {
  emits('submitForm', values, 1)
};


</script>

<style scoped lang="scss"></style>
