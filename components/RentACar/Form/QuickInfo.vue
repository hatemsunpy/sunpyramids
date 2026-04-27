<template>
  <VeeForm :validation-schema="schema" v-slot="{ values, errors }" :initial-values="props.initialValues.quickInfo"
    @submit="submit">
    <div class="grid grid-cols-2 gap-5 pb-24 md:pb-0">
      <div class="w-full col-span-2">
        <div class="w-full lg:flex-row flex-col lg:items-center items-start lg:gap-14 gap-6">
          <h6 class="text-xl font-medium text-textLight min-w-fit">
            {{ $t("labels.whenBeTravelling") }}
          </h6>

          <div class="flex md:flex-row mt-6 flex-col lg:items-center items-start md:gap-12 gap-3 w-full justify-start">
            <UIRadio v-for="option in thisOptions" :title="$t(`labels.${option}`)" :value="option" name="type" />
          </div>
        </div>

        <ClientOnly>
          <div class="grid items-center gap-4 w-full mt-8 grid-cols-1"
            :class="[values.type == 'roundTrip' ? 'lg:grid-cols-2' : 'lg:grid-cols-3']">
            <div class="col-span-1" v-if="values.type == 'oneWay'">
              <UIDate name="picupDate" :title="$t('labels.pickUpDateAndTime')"
                :placeholder="$t('labels.pickUpDateAndTimePlaceholder')" label="inputLabels.dateAnbdTime"
                :maxDate="values.returnDate" icon="calender" :isTime="true" />
            </div>

            <div class="col-span-1" v-if="values.type == 'roundTrip'">
              <UIDate name="picupDate" :title="$t('labels.pickUpDateAndTime')"
                :placeholder="$t('labels.pickUpDateAndTimePlaceholder')" label="inputLabels.dateAnbdTime"
                :maxDate="values.returnDate" icon="calender" :isTime="true" />
            </div>


            <div class="col-span-1" v-if="values.type == 'oneWay'">
              <UISelect @click="values.dropLoaction = '', getDropDownLocation(values.location)" :items="locations"
                title="name" value="id" name="location" :placeholder="$t('labels.locationPlaceholder')"
                :label="$t('labels.carHolder')" />
            </div>

            <div class="col-span-1" v-if="values.type == 'roundTrip'">
              <UISelect @click="values.dropLoaction = '', getDropDownLocation(values.location)" :items="locations"
                title="name" value="id" name="location" :placeholder="$t('labels.locationPlaceholder')"
                :label="$t('labels.carHolder')" />
            </div>


            <div class="col-span-1" v-if="values.type == 'oneWay'">
              <UISelect @click="emits('getRouteById', { location: values.location, dropLocation: values.dropLoaction })"
                :items="dropDownLocations" title="name" value="id" name="dropLoaction"
                :placeholder="$t('labels.dropLoactionPlaceholder')" :label="$t('labels.dropOffLocation')" />
            </div>

            <div class="col-span-1" v-if="values.type == 'roundTrip'">
              <UISelect @click="emits('getRouteById', { location: values.location, dropLoaction: values.dropLoaction })"
                :items="dropDownLocations" title="name" value="id" name="dropLoaction"
                :placeholder="$t('labels.dropLoactionPlaceholder')" :label="$t('labels.dropOffLocation')" />
            </div>


            <div class="col-span-1" v-if="values.type == 'roundTrip'">
              <UIDate name="returnDate" :title="$t('labels.returnDataAndTime')"
                :placeholder="$t('labels.returnDataAndTimePlaceholder')" label="inputLabels.dateAnbdTime"
                :minDate="values.picupDate" icon="calender" :isTime="true" />
            </div>
          </div>
        </ClientOnly>
      </div>

      <div class="col-span-2 md:flex hidden justify-end w-full">
        <UIButton type="submit" :classes="[
          'py-6 !px-12 min-w-fit gap-2 border bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
        ]" postIcon="full-arrow-right" :postIconClasses="['text-2xl mb-0 w-6 h-6']" :text="$t('labels.nextUp')" />
      </div>

      <div class="md:hidden block submitBoxShadow z-20 fixed w-full bg-[#ffffff] p-4 bottom-0  start-0 ">
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

const locations = ref([])

const props = defineProps({
  initialValues: {
    type: Object,
    required: true
  },
  locations: {
    type: Array, required: true
  }
})
const emits = defineEmits(['submitForm', 'getRouteById'])

const { t } = useI18n();
const { postData } = useApi(0)

const thisOptions = ["oneWay", "roundTrip",]
const dropDownLocations = ref([])

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const schema = yup.object().shape({
  type: yup.string().required(),
  location: yup.string().required(t("errors.isRequired", { name: t("labels.location") })),
  picupDate: yup.date().required(t("errors.isRequired", { name: t("labels.location") })),
  dropLoaction: yup.string().required(t("errors.isRequired", { name: t("labels.location") })),
  returnDate: yup.date().nullable().when("type", {
    is: "roundTrip",
    then: (schema) => schema.required(t("errors.isRequired", { name: t("inputLabels.dateAnbdTime") })),
    otherwise: (schema) => schema.nullable(),
  }),
});


watch(() => props.locations, (newVal) => {
  locations.value = newVal
}, {
  immediate: true
})

const submit = (values) => {
  emits('submitForm', values, 1)
};

const getDropDownLocation = async (id) => {
  await postData(`car/rental/available/destinations?page_limit=200&pickup_location_id=${id}`).then((res) => {
    dropDownLocations.value = res.data
  })
}

if (props.initialValues.quickInfo.location) {
  getDropDownLocation(props.initialValues.quickInfo.location)
}
</script>

<style scoped lang="scss"></style>
