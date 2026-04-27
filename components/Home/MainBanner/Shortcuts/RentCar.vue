<template>
  <VeeForm :validation-schema="schema" :initial-values="initialValues" v-slot="{ values, errors }"
    @submit="handleSubmit">
    <div class="p-6 bg-white w-full relative z-30 rounded-[2.5rem]">
      <div class="w-full flex items-center gap-14">
        <h6 class="text-xl font-medium text-textLight min-w-fit">
          {{ $t("labels.tripType") }}
        </h6>

        <div class="flex items-center gap-12 w-full justify-start">
          <UIRadio v-for="option in options" :title="$t(`labels.${option.title}`)" :value="option.value" name="type" />
        </div>
      </div>

      <div class=" gap-1 gap-y-5 w-full mt-6"
        :class="[values.type == 'roundTrip' ? ' grid xl:grid-cols-4 grid-cols-2  items-center' : 'xl:flex grid grid-cols-3 items-center']">
        <div class="col-span-1 w-full" v-if="values.type == 'oneWay'">
          <UIShortcutsSelect v-if="values.type == 'oneWay'" @click="getDropDownLocation(values.location)"
            :items="locations" title="name" value="id" name="location" :placeholder="$t('labels.locationPlaceholder')"
            :label="$t('labels.carHolder')" />
        </div>

        <div class="col-span-1 w-full" v-if="values.type == 'roundTrip'">
          <UIShortcutsSelect v-if="values.type == 'roundTrip'" @click="getDropDownLocation(values.location)"
            :items="locations" title="name" value="id" name="location" :placeholder="$t('labels.locationPlaceholder')"
            :label="$t('labels.carHolder')" />
        </div>

        <div class="col-span-1 w-full" v-if="values.type == 'oneWay'">
          <UIShortcutsSelect v-if="values.type == 'oneWay'" :items="dropDownLocations" title="name" value="id"
            name="dropLoaction" :placeholder="$t('labels.dropLoactionPlaceholder')"
            :label="$t('labels.dropOffLocation')" />
        </div>

        <div class="col-span-1 w-full" v-if="values.type == 'roundTrip'">
          <UIShortcutsSelect v-if="values.type == 'roundTrip'" :items="dropDownLocations" title="name" value="id"
            name="dropLoaction" :placeholder="$t('labels.dropLoactionPlaceholder')"
            :label="$t('labels.dropOffLocation')" />
        </div>

        <div class="col-span-1 w-full" v-if="values.type == 'oneWay'">
          <UIShortcutsDate v-if="values.type == 'oneWay'" name="picupDate" :title="$t('labels.pickUpDateAndTime')"
            :placeholder="$t('labels.pickUpDateAndTimePlaceholder')" label="inputLabels.dateAnbdTime"
            :maxDate="values.returnDate" icon="calender" :isTime="true" />
        </div>

        <div class="col-span-1 w-full" v-if="values.type == 'roundTrip'">
          <UIShortcutsDate name="picupDate" v-if="values.type == 'roundTrip'" :title="$t('labels.pickUpDateAndTime')"
            :placeholder="$t('labels.pickUpDateAndTimePlaceholder')" label="inputLabels.dateAnbdTime"
            :maxDate="values.returnDate" icon="calender" :isTime="true" />
        </div>

        <div class="col-span-1 w-full" v-if="values.type == 'roundTrip'">
          <UIShortcutsDate v-if="values.type == 'roundTrip'" name="returnDate" :title="$t('labels.returnDataAndTime')"
            :placeholder="$t('labels.returnDataAndTimePlaceholder')" label="inputLabels.dateAnbdTime" icon="calender"
            :minDate="values.picupDate" :isTime="true" />
        </div>

        <ClientOnly>
          <div class=" min-w-fit " :class="[values.type == 'roundTrip' ? 'xl:!col-span-4 !col-span-2' : '!col-span-3']">
            <UIButton :classes="[
              'py-6 px-[3.5rem] w-full !justify-center  bg-secondary text-white font-medium hover:bg-[#c57007] h-full',
            ]" :text="$t('labels.sendRequest')" type="submit" />
          </div>
        </ClientOnly>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="js">
import { configure } from "vee-validate";
import * as yup from "yup";

const { t } = useI18n();

const router = useRouter()
const localePath = useLocalePath()

const { getData, postData } = useApi()


const locations = ref([])
const dropDownLocations = ref([])

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const schema = yup.object().shape({
  type: yup.string().required(t("errors.isRequired", { name: t("inputLabels.phone") })),
  dropLoaction: yup.date().required(t("errors.isRequired", { name: t("labels.location") })),
  returnDate: yup.date().when("type", {
    is: "roundTrip",
    then: (schema) => schema.required(t("errors.isRequired", { name: t("inputLabels.dateAnbdTime") })),
  }),
  location: yup.string().required(t("errors.isRequired", { name: t("labels.locations") })),
  picupDate: yup.string().required(t("errors.isRequired", { name: t("inputLabels.dateAnbdTime") })),
});


const options = [{
  title: "oneWay",
  value: "oneWay"
}, {
  title: "roundTrip",
  value: "roundTrip"
}]

const initialValues = ref({
  type: 'oneWay',
  location: ''
});

const handleSubmit = (values) => {
  if (values.type == 'oneWay') {
    router.push({ path: localePath('rent-car'), query: { type: 'oneWay', picupDate: values.picupDate, location: values.location, dropLoaction: values.dropLoaction } })
  } else if (values.type == 'roundTrip') {
    router.push({ path: localePath('rent-car'), query: { type: 'roundTrip', picupDate: values.picupDate, location: values.location, returnDate: values.returnDate, dropLoaction: values.dropLoaction } })
  }
};

const getLocations = async () => {
  await getData('locations?page_limit=200&order_by=id,asc').then((res) => {
    locations.value = res.data.data
  })
}
getLocations()

const getDropDownLocation = async (id) => {
  await postData(`car/rental/available/destinations?page_limit=200&pickup_location_id=${id}`).then((res) => {
    dropDownLocations.value = res.data
  })
}
</script>

<style scoped lang="scss"></style>
