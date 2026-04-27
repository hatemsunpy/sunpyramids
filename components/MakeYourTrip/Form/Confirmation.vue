<template>
  <div class="grid grid-cols-2 gap-5 gap-y-8  pb-24 md:pb-0">
    <div class="col-span-2 flex justify-between items-center">
      <h6 class="font-medium text-xl">{{ $t("labels.info") }}</h6>

      <UIButton type="button" :classes="[
        '!py-2 !px-6 font-medium border border-primary hover:text-white hover:bg-primary transition-all',
      ]" :text="$t('labels.edit')" @click="emits('getFirstSpte')" />
    </div>

    <div class="col-span-2 grid md:grid-cols-2  gap-y-8">
      <div class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("labels.travelerName") }}
        </p>

        <p class="font-medium">
          {{ props.initialValues.personalInfo.fullName }}
        </p>
      </div>

      <div class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("labels.whenBeTravelling") }}
        </p>

        <p class="font-medium">
          {{ $t(`labels.${props.initialValues.quickInfo.type}`) }}
        </p>
      </div>

      <div v-if="props.initialValues.quickInfo.type == 'existTime'"
        class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("labels.startDay") }}
        </p>

        <p class="font-medium">
          {{ dateFormat(props.initialValues.quickInfo.fromDate, "date") }}
        </p>
      </div>

      <div v-if="props.initialValues.quickInfo.type == 'approximateTime'"
        class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("labels.monthTrip") }}
        </p>

        <p class="font-medium">
          {{ dateFormat(props.initialValues.quickInfo.month, "month") }}
        </p>
      </div>

      <div v-if="props.initialValues.quickInfo.type == 'notSureYet'"
        class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("labels.tripDuration") }}
        </p>

        <p class="font-medium">
          {{ props.initialValues.quickInfo.days }} {{ $t("labels.days") }}
        </p>
      </div>

      <div v-if="props.initialValues.quickInfo.type == 'existTime'"
        class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("labels.endDay") }}
        </p>

        <p class="font-medium">
          {{ dateFormat(props.initialValues.quickInfo.toDate, "date") }}
        </p>
      </div>

      <div class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("inputLabels.phone") }}
        </p>

        <p class="font-medium">
          {{ props.initialValues.personalInfo.phone }}
        </p>
      </div>

      <div class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("inputLabels.nationality") }}
        </p>

        <p class="font-medium">
          {{nationalities.find((ele) => ele.id == props.initialValues.personalInfo.nationality)?.name}}
        </p>
      </div>

      <div class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("inputLabels.addFlightOffer") }}
        </p>

        <p class="font-medium">
          {{
          props.initialValues.personalInfo.flightOffer
          ? $t("labels.yes")
          : $t("labels.no")
          }}
        </p>
      </div>

      <div class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("inputLabels.price") }}
        </p>

        <p class="font-medium">
          {{
          `${props.initialValues.personalInfo.min}$ - ${props.initialValues.personalInfo.max}$`
          }}
        </p>
      </div>

      <div class="col-span-2 md:h-[2px] h-2 -mx-4  md:bg-[#F9FAFB] bg-[#eeeeee]"></div>


      <div class="col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("inputLabels.note") }}
        </p>

        <p class="font-medium">
          {{ `${props.initialValues.personalInfo.note}` }}
        </p>
      </div>
    </div>

    <div class="col-span-2 md:flex hidden  justify-end w-full gap-8">
      <UIButton @click="router.push(localePath('/'))" type="button" :classes="[
        'py-4 !px-12 font-medium border !min-w-fit me-2  gap-2 border-[1px] text-textDark   font-meduim hover:text-white border-textLight hover:bg-textDark',
      ]" :text="$t('labels.cancel')" />
      <UIButton type="submit" @click="emits('submitForm', null, 3)" :classes="[
        'py-4 !px-12 min-w-fit gap-2 border bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
      ]" :text="$t('labels.submit')" />
    </div>

    <div class="md:hidden submitBoxShadow submitBoxShadow flex z-20 fixed w-full bg-[#ffffff] p-4 bottom-0  start-0 ">
      <UIButton @click="router.push(localePath('/'))" type="button" :classes="[
        'py-4 !px-12 font-medium border !w-full me-2 !justify-center  gap-2 border-[1px] text-textDark   font-meduim hover:text-white border-textLight hover:bg-textDark',
      ]" :text="$t('labels.cancel')" />

      <UIButton type="submit" @click="emits('submitForm', null, 3)" :classes="[
        'py-4 !px-12 min-w-fit gap-2 !w-full border !justify-center bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
      ]" :text="$t('labels.submit')" />
    </div>
  </div>
</template>

<script setup lang="js">
const emits = defineEmits(['getFirstSpte', 'submitForm'])

const router = useRouter()
const localePath = useLocalePath()

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

const nationalities = ref([])

watch(() => props.nationalities, (newVal) => {
  nationalities.value = newVal
}, {
  immediate: true
})

const dateFormat = function (dateInput, type) {
  const input = dateInput
  if (type === "date") {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  } else if (type === "month") {
    const { month, year } = input;
    const date = new Date(year, month); // month is zero-based in JavaScript Date
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  } else {
    return "Invalid type. Use 'date', 'time', or 'month'.";
  }
}
</script>

<style scoped lang="scss"></style>
