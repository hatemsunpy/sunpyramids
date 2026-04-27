<template>
  <div class="bg-black/80 fixed flex justify-center items-center top-0 left-0 w-full h-screen z-[99999]">
    <div class=" 2xl:w-2/3 lg:w-3/4 w-[90%] h-[95vh] rounded-3xl bg-[#ffffff]">
      <div class="flex justify-between items-center p-4 ps-6">
        <h4 class="text-xl font-medium">
          {{ $t("labels.tours.viewDistination") }}
        </h4>

        <button @click="emits('close')"
          class="text-textDark border hover:bg-textDark hover:text-white transition-all border-textDark/30 flex items-center justify-center w-10 h-10 rounded-full">
          <NuxtIcon name="add" class="text-xl rotate-45" />
        </button>
      </div>

      <div class="w-full h-[85vh] px-6 lg:overflow-hidden overflow-y-auto grid grid-cols-2 gap-6">
        <div class="lg:col-span-1 col-span-2 min-h-[50vh]  overflow-hidden rounded-xl h-full">
          <UIMap :zoomControl="true" :PolygonCoords="props.polygonCoords" :zoom="6" />
        </div>

        <div class="lg:col-span-1 col-span-2 pt-4">
          <h4 class="lg:text-3xl text-2xl font-medium mb-7" v-if="tour.title">{{ tour.title }}</h4>

          <div class="flex justify-between items-end mb-4">
            <div>
              <p class="text-sm text-[#666666] mb-2">
                {{ $t("inputLabels.price") }}
              </p>

              <div class="flex items-end gap-2">
                <p class="text-3xl font-bold">{{ selectedCurrancies.symbol }}{{
                  (props.price.withDicount).toFixed(2) }}</p>

                <p v-if="props.tour?.offer != 0"
                  class="text-xl font-medium  text-[#A5A5A5] line-through decoration-2 decoration-[#F55157]">
                  {{ selectedCurrancies.symbol }}{{
                    (props.price.price).toFixed(2) }}
                </p>
              </div>
            </div>

            <UIButton :text="$t('labels.tours.share')" @click="shareTour"
              :classes="['py-4 gap-3 font-medium hover:!text-white hover:bg-textDark duration-0 !px-8 border !text-textDark']"
              preIcon="send" :preIconClasses="['!text-textDark group-hover:!text-white text-2xl w-5 h-5']" />
          </div>

          <div v-if="props.tour?.offer != 0" class="rounded-2xl overflow-hidden grid grid-cols-4 gap-1 mb-6 ">
            <div v-for="(item, index) in timeValues" :key="index" class="bg-[#FFF2F3] py-1 px-2 text-center">
              <p class="text-[#F55157] text-sm font-medium">{{ timer[item.value] }}</p>

              <p class="text-xs text-[#F9979A]">
                {{ $t(`labels.time.${item.title}`) }}
              </p>
            </div>
          </div>

          <div class="mb-6">
            <UIButton :classes="['w-full py-4 hover:bg-[#143485]  font-medium text-white bg-primary !justify-center']"
              :text="$t('labels.tours.BookNow')" />
          </div>

          <div class="!h-[300px]">
            <h6 class="text-xl font-medium mb-3 text-textLight">{{ $t('labels.tours.distinations') }}</h6>

            <div class="flex flex-col gap-0 lg:max-h-[400px] overflow-y-auto">
              <template v-for="(item, index) in props.data">
                <div v-if="!item.featured" class="relative  mb-5 ps-10">
                  <NuxtIcon name="location-filled" v-if="index == 0"
                    class="absolute elementAfterthis text-primary top-1/2 left-0 -translate-y-1/2" />


                  <img v-else-if="index + 1 == props.data.length" src="../../../../assets/icons/flag.png"
                    class="absolute  top-1/2 left-0 -translate-y-1/2" />

                  <div v-else class="absolute  elementAfterthis  top-1/2 left-0 -translate-y-1/2 ">
                    <img src="../../../../assets/icons/circle.png" />
                  </div>
                  <p class="font-medium   text-[15px]">{{ item.title }}</p>
                </div>

                <!-- <div v-else>
                  <p class="font-medium   text-[15px]">{{ item.title }}</p>
                </div> -->
              </template>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { sharedStore } from '~/stores/sharedStore.js'
import { storeToRefs } from 'pinia'
const emits = defineEmits(['close'])
const props = defineProps({
  tour: {
    type: Object
  },
  data: {
    type: Array,
    required: true
  },
  polygonCoords: {
    type: Array,
    required: true
  },
  price: {
    type: Object
  }
})

const { selectedCurrancies } = storeToRefs(sharedStore())

const shareTour = async () => {
  navigator.share({
    title: document.title,
    text: 'Check this out!',
    url: window.location.href,
  });
};

const tour = ref(null)
watch(() => props.tour, (newVal) => {
  if (newVal) {
    tour.value = newVal
    if (process.client) {
      setInterval(() => {
        calculateDuration(tour.value?.offer_end_date)
      }, 1000);
    }
  }
}, {
  deep: true,
  immediate: true
})
const timer = ref({
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00'
})
const timeValues = [{ title: "day", value: "days" }, { title: "hour", value: "hours" }, { title: "minute", value: "minutes" }, { title: "second", value: "seconds" }]

function calculateDuration(dateString) {
  const targetDate = new Date(dateString).getTime(); // Convert input date to timestamp
  const now = Date.now(); // Current timestamp in milliseconds
  const diff = Math.abs(targetDate - now); // Calculate the difference

  const days = Math.floor(diff / (3600 * 24 * 1000));
  const hours = Math.floor((diff % (3600 * 24 * 1000)) / (3600 * 1000));
  const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  timer.value = {
    days: days < 10 ? '0' + days : days.toString(),
    hours: hours < 10 ? '0' + hours : hours.toString(),
    minutes: minutes < 10 ? '0' + minutes : minutes.toString(),
    seconds: seconds < 10 ? '0' + seconds : seconds.toString(),
  };
}


</script>

<style scoped lang="scss">
.elementAfterthis {
  @apply after:content-[''] after:h-7 after:w-[2px] z-10 after:bg-textLight/50 after:absolute after:-translate-x-1/2 after:left-1/2 after:top-full;
}
</style>
