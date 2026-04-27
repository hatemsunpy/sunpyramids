<template>
  <VeeForm :validation-schema="schema" :initial-values="initialValues" v-slot="{ values, errors }" @submit="submit">
    <div class="p-6 bg-white w-full relative z-30 rounded-[2.5rem]">
      <div class="w-full flex lg:flex-row flex-col lg:items-center items-start lg:gap-14 gap-6">
        <h6 class="text-xl font-medium text-textLight min-w-fit">
          {{ $t("labels.whenBeTravelling") }}
        </h6>

        <div class="flex md:flex-row flex-col lg:items-center items-start md:gap-12 gap-3 w-full justify-start">
          <UIRadio v-for="option in options" :title="$t(`labels.${option.title}`)" :value="option.value" name="type" />
        </div>
      </div>

      <div class="flex lg:flex-row flex-col items-center  gap-4 w-full mt-6">
        <UIShortcutsDate v-if="values.type == 'existTime'" name="fromDate" :title="$t('labels.from')"
          :placeholder="$t('labels.selectStartDate')" label="inputLabels.Date" :maxDate="values.toDate"
          icon="calender" />

        <UIShortcutsDate v-if="values.type == 'existTime'" name="toDate" :title="$t('labels.to')"
          :placeholder="$t('labels.selectEndDate')" label="inputLabels.Date" icon="calender"
          :minDate="values.fromDate" />

        <UIShortcutsDate v-if="values.type == 'approximateTime'" name="month" :title="$t('labels.selectMonth')"
          :placeholder="$t('labels.selectExpectedMonth')" label="inputLabels.month" icon="calender" :isMonth="true" />
        <UIShortcutsText v-if="values.type == 'notSureYet'" :placeholder="$t('inputLabels.numberOfDays')"
          :title="$t('labels.manyDays')" type="number" name="days" />

        <ClientOnly>
          <UIButton :classes="[
            'py-4 px-[3.5rem]  w-full lg:hidden flex !justify-center md:py-6  bg-secondary text-white font-medium hover:bg-[#c57007] h-full',
          ]" :text="$t('labels.makeTrip')" type="submit" />
          <UIButton :classes="[
            'py-4 px-[3.5rem] min-w-fit lg:flex hidden !justify-center md:py-6  bg-secondary text-white font-medium hover:bg-[#c57007] h-full',
          ]" :text="$t('labels.makeTrip')" type="submit" />
        </ClientOnly>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="js">
import { configure } from "vee-validate";
import * as yup from "yup";

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();


configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const schema = yup.object().shape({
  type: yup.string().required(),
  fromDate: yup.date().when("type", {
    is: "existTime",
    then: (schema) => schema.required(t("errors.isRequired", { name: t("inputLabels.Date") })),
  }),
  toDate: yup.date().when("type", {
    is: "existTime",
    then: (schema) => schema.required(t("errors.isRequired", { name: t("inputLabels.Date") })),
  }),
  month: yup.object().when("type", {
    is: "approximateTime",
    then: (schema) => schema.required(t("errors.isRequired", { name: t("labels.selectExpectedMonth") })),
  }),
  days: yup
    .string()
    .when("type", {
      is: "notSureYet",
      then: (schema) =>
        schema
          .required(t("errors.isRequired", { name: t("inputLabels.numberOfDays") }))
          .test(
            "not-zero",
            t("errors.mustBeGreaterThanZero", { name: t("inputLabels.numberOfDays") }),
            (value) => value > 0
          ),
    }),
});
const options = [{
  title: "existTime",
  value: "existTime"
}, {
  title: "approximateTime",
  value: "approximateTime"
}, {
  title: "notSureYet",
  value: "notSureYet"
},]

const initialValues = ref({
  type: 'existTime'
});

const submit = (values) => {
  if (values.type == 'existTime') {
    router.push({ path: localePath('make-your-trip'), query: { type: 'existTime', from: values.fromDate, to: values.toDate } })
  } else if (values.type == 'approximateTime') {
    router.push({ path: localePath('make-your-trip'), query: { type: 'approximateTime', month: values.month } })
  } else if (values.type == 'notSureYet') {
    router.push({ path: localePath('make-your-trip'), query: { type: 'notSureYet', days: values.days } })
  }
};
</script>

<style scoped lang="scss"></style>
