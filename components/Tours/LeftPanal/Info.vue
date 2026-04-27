<template>

  <section class="px-4 my-4 lg:hidden">
    <h4 v-if="tour && tour.title" class="text-2xl md:hidden font-medium w-full mb-4">
      {{ tour?.title }}
    </h4>

    <div v-if="tour && tour?.offer != 0" class="w-full border  border-[#F55157] rounded-3xl  overflow-hidden">
      <div class="w-full bg-[#f55157] py-1 flex items-center justify-center gap-[6px]  text-center">

        <NuxtIcon name="discount" class="text-white" />

        <p class="text-white text-sm">{{ $t('labels.spaicalOffer') }}</p>
      </div>

      <div class="rounded-2xl overflow-hidden grid grid-cols-4 gap-1 my-2  mx-3 ">
        <div v-for="(item, index) in timeValues" :key="index" class="bg-[#FFF2F3] py-1 px-2 text-center">
          <p class="text-[#F55157] text-sm font-medium">{{ timer[item.value] }}</p>

          <p class="text-xs text-[#F9979A]">
            {{ $t(`labels.time.${item.title}`) }}
          </p>
        </div>
      </div>
    </div>
  </section>
  <section class="py-12 grid px-4 md:px-0 grid-cols-2 lg:grid-cols-4 gap-5">

    <div class="bg-[#f9fafb] w-full py-4 flex flex-col items-center gap-3 rounded-2xl">
      <div class="flex gap-1 text-[##1D1F1F] items-center">
        <NuxtIcon name="clock" />

        <p class="text-sm">{{ $t('labels.tours.duration') }}</p>
      </div>

      <p class="text-xl text-primary font-medium">{{ tour?.duration }} </p>
      <!-- 
      <p class="text-xl text-primary font-medium">{{ tour?.duration_in_days }} {{ $t(tour?.duration_in_days == 1 ?
        `labels.tours.day` : `labels.tours.days`) }}</p> -->
    </div>

    <div class="bg-[#f9fafb] w-full  py-4 flex flex-col items-center gap-3 rounded-2xl">
      <div class="flex gap-1 text-[##1D1F1F] items-center">
        <NuxtIcon name="location" />

        <p class="text-sm">{{ $t('labels.tours.cities') }}</p>
      </div>

      <p v-if="tour?.destinations && tour?.destinations?.length" class="text-xl text-primary font-medium"> {{
        tour?.destinations?.filter(dest => dest.global === false && dest.enabled && dest.featured)?.length}} {{
          $t('labels.tours.cities') }}
      </p>
    </div>

    <div class="bg-[#f9fafb] w-full py-4 flex flex-col items-center gap-3 rounded-2xl">
      <div class="flex gap-1 text-[##1D1F1F] items-center">
        <NuxtIcon name="redo" />

        <p class="text-sm">{{ $t('labels.tours.type') }}</p>
      </div>

      <p class="text-xl text-primary font-medium">{{ tour?.type }}</p>
    </div>

    <div class="bg-[#f9fafb] w-full py-4 flex flex-col items-center gap-3 rounded-2xl">
      <div class="flex gap-1 text-[##1D1F1F] items-center">
        <NuxtIcon name="category" />

        <p class="text-sm">{{ $t('labels.tours.category') }}</p>
      </div>

      <p class="text-xl text-primary font-medium" v-if="tour && tour.categories[0]">{{ tour?.categories[0].title }}</p>
    </div>
  </section>


  <section>
    <div class="my-12">
      <ToursSharedHeader :expand="false" :title="$t('labels.tours.overView')">
        <div class="mt-4 flex md:flex-row flex-col gap-6">
          <div class="border border-dark w-full py-6 flex flex-col items-center gap-3 rounded-2xl">
            <div class="flex  gap-1 text-[##1D1F1F] items-center">
              <NuxtIcon name="clock" />

              <p class="text-sm">{{ $t('labels.tours.pickup') }}</p>
            </div>

            <p class="text-xl text-primary font-medium">{{ tour?.pickup_time }}</p>
          </div>

          <div class="border border-dark w-full py-6 flex flex-col items-center gap-3 rounded-2xl">
            <div class="flex gap-1 text-[##1D1F1F] items-center">
              <NuxtIcon name="calendar-available" />

              <p class="text-sm">{{ $t('labels.tours.availablity') }}</p>
            </div>

            <p class="text-xl text-primary font-medium">{{ tour?.run }}</p>
          </div>
        </div>

        <div class="flex flex-col gap-8 mt-7 text-[#666666] leading-6" v-html="tour?.overview">
        </div>
        <!-- <p class="text-[#666666] leading-6">8 Days Tour to Pyramids, Luxor and Aswan Nile Cruise by Air offers a
          complete travel
          adventure through the
          miraculous wonders of ancient Egypt. Sun Pyramids Tours provides ideal services</p>
        <p class="text-[#666666] leading-6">including a private A/C vehicle, comfortable flights, and a professional
          Egyptologist tour guide, ensuring a high-quality experience. Guests will have the incredible opportunity to
          unleash their inner adventurer with this irresistible 8-day tour,
          feasting their eyes on the iconic Giza Pyramids, the mighty Sphinx, and more</p> -->
      </ToursSharedHeader>
    </div>
  </section>
</template>

<script setup lang='js'>
const props = defineProps({
  tour: {
    type: Object
  }
})

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

const timeValues = [{ title: "day", value: "days" }, { title: "hour", value: "hours" }, { title: "minute", value: "minutes" }, { title: "second", value: "seconds" }]
const timer = ref({
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00'
})

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

<style scoped lang='scss'></style>