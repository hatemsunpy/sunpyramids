<template>
  <div class="grid grid-cols-2 gap-5 gap-y-8   pb-24 md:pb-0">
    <div class="col-span-2 flex justify-between items-center">
      <h6 class="font-medium text-xl">{{ $t("labels.info") }}</h6>

      <UIButton type="button" :classes="[
        '!py-2 !px-6 font-medium border border-primary hover:text-white hover:bg-primary transition-all',
      ]" :text="$t('labels.edit')" @click="emits('getFirstSpte')" />
    </div>

    <div class="col-span-2 grid md:grid-cols-2 gap-y-8">
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
          {{ $t("labels.tripType") }}
        </p>

        <p class="font-medium">
          {{ $t(`labels.${props.initialValues.quickInfo.type}`) }}
        </p>
      </div>

      <div class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("labels.travelDate") }}
        </p>

        <p class="font-medium">
          {{ formatDate(props.initialValues.quickInfo.picupDate, "time") }}
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
          {{ $t("labels.picUpLocation") }}
        </p>

        <p class="font-medium">
          {{ data.pickup }}
        </p>
      </div>
      <div class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("labels.dropOffLocation") }}
        </p>

        <p class="font-medium">
          {{ data.dropOff }}
        </p>
      </div>

      <div class="md:col-span-1 col-span-2 border-s-4 border-s-[#EEEEEE] ps-3">
        <p class="text-textLight mb-2">
          {{ $t("inputLabels.nationality") }}
        </p>

        <p class="font-medium">
          {{ data.nationality }}
        </p>
      </div>
    </div>

    <div class="col-span-2 md:h-[2px] h-2 -mx-4  md:bg-[#F9FAFB] bg-[#eeeeee]"></div>
    <div v-if="(props.initialValues.quickInfo.type
      == 'oneWay' && props.money[0].oneway_price) || (props.initialValues.quickInfo.type
        == 'roundTrip' && props.money[0].rounded_price)" class="col-span-2 mb-10 flex justify-between items-center">
      <h6 class="font-medium text-xl">{{ $t('labels.totalPrice') }}</h6>

      <h4 class="font-medium text-[2.1rem] text-secondary">{{ props.initialValues.quickInfo.type
        == 'oneWay' ? props.money[0]?.oneway_price :
        props.money[0]?.rounded_price }}$</h4>
    </div>

    <div class="col-span-2 md:flex hidden  justify-end w-full gap-8">
      <UIButton @click="router.push(localePath('/'))" type="button" :classes="[
        'py-4 !px-12 font-medium border !min-w-fit me-2  gap-2 border-[1px] text-textDark   font-meduim hover:text-white border-textLight hover:bg-textDark',
      ]" :text="$t('labels.cancel')" />
      <UIButton @click="emits('submitForm', null, 3)" :classes="[
        'py-4 !px-12 min-w-fit gap-2 border bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
      ]" :text="$t('labels.addToCart')" />
    </div>

    <div class="md:hidden submitBoxShadow flex z-20 fixed w-full bg-[#ffffff] p-4 bottom-0  start-0 ">
      <UIButton @click="router.push(localePath('/'))" type="button" :classes="[
        'py-4 !px-12 font-medium border !w-full !justify-center me-2  gap-2 border-[1px] text-textDark   font-meduim hover:text-white border-textLight hover:bg-textDark',
      ]" :text="$t('labels.cancel')" />
      <UIButton @click="emits('submitForm', null, 3)" :classes="[
        'py-4 !px-12 !w-full !justify-center gap-2 border bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
      ]" :text="$t('labels.addToCart')" />
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
  },
  locations: {
    type: Array,
  },
  money: {
    type: Array,
  }
})
const data = ref({
  nationality: "",
  pickup: "",
  dropOff: ""
})

watch(() => props.nationalities, (newVal) => {
  if (newVal) {
    data.value.nationality = newVal.find((ele) => ele.id == props.initialValues.personalInfo.nationality)
    if (data.value.nationality) {
      data.value.nationality = data.value.nationality.name
    }
  }
}, {
  immediate: true
})

watch(() => props.locations, (newVal) => {
  if (newVal) {
    data.value.pickup = newVal.find((ele) => ele.id == props.initialValues.quickInfo.location)
    if (data.value.pickup) {
      data.value.pickup = data.value.pickup.name
    }
    data.value.dropOff = newVal.find((ele) => ele.id == props.initialValues.quickInfo.dropLoaction)
    if (data.value.dropOff) {
      data.value.dropOff = data.value.dropOff.name
    }
  }
}, {
  immediate: true
})


function formatDate(input, type) {
  if (type === "date") {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  } else if (type === "time") {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }) + " at " + date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).toLowerCase();
  } else if (type === "month") {
    const { month, year } = input;
    const date = new Date(year, month - 1); // month is zero-based in JavaScript Date
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
