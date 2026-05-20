<template>
  <section class="">
    <div class="h-[60vh] relative flex">
      <img :src="props.img" class="absolute start-0 w-full h-full object-cover lg:block hidden brightness-75" />
      <img :src="props.imgPhone ?? props.img"
        class="absolute start-0 w-full h-full object-cover lg:hidden block brightness-75" />

      <!-- <NuxtImg src="/images/IMG_3817.jpg" class="absolute start-0 w-full h-full" /> -->
      <div
        class="text-center font-bold text-white top-10 xl:px-48 h-full flex items-center justify-center  w-full flex-col !z-10">
        <!-- <h1 class="2xl:text-5xl lg:text-[2rem] text-2xl   2xl:leading-[4.0625rem] leading-[2.5rem] secondText "> -->
        <h1 class="2xl:text-3xl text-[1.50rem]   2xl:leading-[4.0625rem] leading-[2.5rem] secondText ">
          {{ props.title }}
        </h1>



        <div v-if="timer && !isDatePast" class="rounded-xl overflow-hidden grid grid-cols-8 gap-1 mt-2">
          <div v-for="(item, index) in timeValues" :key="index" class="col-span-2 py-1 lg:w-32 w-24 px-2 text-center">
            <p class="lg:text-xl text-sm font-normal mb-2 text-white/80 text-center w-full">
              {{ $t(`labels.time.${item.title}`).toLocaleUpperCase() }}
            </p>

            <p
              class="2xl:text-7xl text-5xl lg:text-4xl font-medium text-center relative flex justify-center  items-center ">
              {{ timer[item.value]
              }}
              <!-- <p class="text-5xl translate-x-2 text-center" v-if="index != 3">:</p> -->
            </p>

          </div>
        </div>

      </div>

      <SharedIceFalling v-if="isIceMode" />
    </div>
  </section>
</template>

<script setup lang="js">
const props = defineProps({
  img: {
    type: String,
    required: true
  },
  imgPhone: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: false
  }
})

const route = useRoute()
const localePath = useLocalePath()

const isIceMode = route.fullPath == localePath("/event/egypt-christmas-event-2025")


const timer = ref(null)
const timeValues = [{ title: "day", value: "days" }, { title: "hour", value: "hours" }, { title: "minute", value: "minutes" }, { title: "second", value: "seconds" }]


function calculateDuration(dateString) {
  const targetDate = new Date(dateString).getTime();
  const now = Date.now();
  const diff = Math.abs(targetDate - now);

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

const isDatePast = computed(() => {
  if (!props.date) return false;
  const targetDate = new Date(props.date).getTime();
  const now = Date.now();
  return now > targetDate;
});



onMounted(() => {
  if (props.date)
    if (process.client) {
      setInterval(() => {
        calculateDuration(props.date)
      }, 1000);
    }
})
</script>

<style scoped lang="scss"></style>

<style lang="scss">
.secondText {
  text-shadow: 0px 4px 40px rgba(0, 0, 0, 0.4), 0px 4px 24px rgba(0, 0, 0, 0.4);
}

.mainSwiper {
  @apply w-full h-full relative;

  .swiper-pagination-fraction,
  .swiper-pagination-custom,
  .swiper-horizontal>.swiper-pagination-bullets,
  .swiper-pagination-bullets.swiper-pagination-horizontal {
    @apply bottom-8;
  }

  .swiper-pagination {
    @apply bottom-96;
  }

  .swiper-pagination-bullet {
    @apply bg-white w-[11px] h-[11px] rounded-full opacity-100;
  }

  .swiper-pagination-bullet-active {
    @apply bg-secondary;
  }
}

.ice-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.ice-drop {
  position: absolute;
  top: -10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow:
    0 0 6px rgba(255, 255, 255, 0.8),
    0 0 12px rgba(173, 216, 230, 0.5);
  backdrop-filter: blur(3px);
  animation: fall linear infinite;
}

@keyframes fall {
  0% {
    transform: translateY(-10vh) scale(1);
    opacity: 1;
  }

  100% {
    transform: translateY(110vh) scale(0.8);
    opacity: 0.4;
  }
}
</style>
