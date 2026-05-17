<template>
  <div class="tourCardBox group h-full" @mouseenter="isHoverIn = true" @mouseleave="isHoverIn = false">
    <swiper :modules="modules" class="tourCardSwiper" :pagination="{ clickable: true }" :autoplay="isHoverIn ? {
      delay: 3000,
      disableOnInteraction: false
    } : false" @swiper="setSwiperInstance">
      <swiper-slide class="overflow-hidden h-full" v-for="img in props.item?.gallery.slice(0, 6)" :key="img">
        <NuxtLink :to="localePath(`/tour/${props.item?.slug}`)" :prefetch="false">
          <NuxtImg class="w-full h-full object-cover cursor-pointer" :src="img" alt="TourCard"
            :loading="img === props.item?.gallery[0] ? 'eager' : 'lazy'" width="400" height="194" />
        </NuxtLink>
      </swiper-slide>

      <button @mouseenter="isHoverHeart = true" @mouseleave="isHoverHeart = false" @click="likeTour"
        class="absolute top-2 end-2 h-10 w-10 flex justify-center items-center cursor-pointer focus:!text-[#f55157] group/heart bg-white z-10 rounded-full">
        <NuxtIcon :name="isLiked ? 'heart' : isHoverHeart ? 'heart' : 'heart-nonfill'"
          class="mb-0 group-hover/heart:text-[#fccbcd] transition-all   text-2xl w-6 h-6 text-"
          :class="[isLiked ? '!text-[#f55157]' : isHoverHeart ? 'group-hover/heart:text-[#fccbcd] ' : 'text-[#DEDEDE]',]" />
      </button>

      <div v-if="props.item?.offer"
        class="absolute top-2 start-2 px-3 py-1 flex  items-center gap-[6px] group/heart bg-[#f55157] z-10 rounded-full">
        <NuxtIcon name="discount" class="text-white" />

        <p class="text-sm font-medium text-white">{{ $t("labels.spaicalOffer") }}</p>
      </div>
    </swiper>

    <div class="flex flex-col gap-4">
      <NuxtLink :to="localePath(`/tour/${props.item?.slug}`)" :prefetch="false">
        <h6 class="2xl:text-xl xl:text-xl md:block hidden text-base mt-4 px-2 h-[3.25rem] font-medium cursor-pointer"
          @click="router.push(localePath(`/tour/${props.item?.slug}`))">
          {{ props.item?.title && props.item?.title.length > 45 ? props.item?.title.slice(0, 45) + '...' :
            props.item?.title }}
        </h6>
        <h6 class="2xl:text-xl xl:text-xl block md:hidden text-base mt-4 px-2 h-[3.25rem] font-medium cursor-pointer"
          @click="router.push(localePath(`/tour/${props.item?.slug}`))">
          {{ props.item?.title && props.item?.title.length > 40 ? props.item?.title.slice(0, 40) + '...' :
            props.item?.title }}
        </h6>
      </NuxtLink>

      <div class="px-2 flex flex-col mt-auto gap-4">
        <div class="flex items-center flex-wrap gap-2">
          <div v-if="props.item?.destinations?.length"
            class="text-[#017375] flex items-center gap-1 px-2 py-1 bg-[#E9F5F5] w-fit rounded-full">
            <NuxtIcon name="location" class="mb-0" />

            <p class="text-sm">{{props.item?.destinations?.length > 1 ? `${props.item?.destinations?.filter(dest =>
              dest.global === false && dest.enabled && dest.featured)?.length} Cities`
              :
              props.item?.destinations[0].title}}</p>
          </div>

          <template v-if="props.item?.categories?.length">
            <p v-for="item in props.item?.categories.slice(0, 1)"
              class="text-sm text-[#945405] px-2 py-1 bg-[#fef3e6] w-fit rounded-full">
              {{ item?.title }}
            </p>
          </template>
        </div>

        <div v-if="props.showTimer" class="rounded-xl overflow-hidden grid grid-cols-4 gap-1">
          <div v-for="(item, index) in timeValues" :key="index" class="bg-[#FFF2F3] py-1 px-2 text-center">
            <p class="text-[#F55157] font-medium">{{ timer[item.value] }}</p>

            <p class="text-sm text-[#F9979A]">
              {{ $t(`labels.time.${item.title}`) }}
            </p>
          </div>
        </div>

        <div class="flex justify-between items-end">
          <div>
            <p class="text-[0.625rem] text-[#666666]">
              {{ $t("labels.startFrom") }}
            </p>

            <div class="flex items-end gap-2">
              <p class="text-2xl font-bold" v-if="selectedCurrancies">{{ selectedCurrancies.symbol }}{{
                props.item?.offer ?
                  ((props.item?.start_from * (100
                    - props.item?.offer)
                    /
                    100) * selectedCurrancies.exchange_rate).toFixed(2) :
                  (props.item?.start_from * selectedCurrancies.exchange_rate).toFixed(2) }}</p>

              <p v-if="props.item?.offer && selectedCurrancies"
                class="text-base font-medium text-[#A5A5A5] line-through decoration-2 decoration-[#F55157]">
                {{ selectedCurrancies.symbol }}{{ (props.item?.start_from *
                  selectedCurrancies.exchange_rate).toFixed(2)
                }}
              </p>
            </div>
          </div>

          <div v-if="props.item?.duration"
            class="flex items-center gap-[6px] py-1 px-4 rounded-full border border-dark">
            <NuxtIcon name="clock" class="text-base w-4 h-4 text-[#A5A5A5] mb-0" />

            <p class="my-0">{{ props.item?.duration }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { sharedStore } from '~/stores/sharedStore.js'
import { storeToRefs } from 'pinia'
const props = defineProps({
  showTimer: {
    type: Boolean,
    default: false
  }, item: {
    type: Object
  }
});

const isHoverIn = ref(false)
const isHoverHeart = ref(false)
const isLiked = ref(props.item.wishlisted_exists)

const swiperInstance = ref(null);

const setSwiperInstance = (swiper) => {
  swiperInstance.value = swiper;
};

// Watch the hover state to control autoplay
watch(isHoverIn, (newVal) => {
  if (swiperInstance.value) {
    if (newVal) {
      swiperInstance.value.autoplay.start();
    } else {
      swiperInstance.value.autoplay.stop();
    }
  }
});

//swiper setup
import { Swiper } from "swiper/vue";
import { Pagination, Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/pagination";
let modules = [Pagination, Autoplay];

const { selectedCurrancies } = storeToRefs(sharedStore())
const toast = useNuxtApp().$toast
const { putData } = useApi()



//timer Function
const timer = ref({
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00'
})
const timeValues = [{ title: "day", value: "days" }, { title: "hour", value: "hours" }, { title: "minute", value: "minutes" }, { title: "second", value: "seconds" }]
const time = 1791122320
const isOffered = true
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

function extractDuration(input) {
  const daysMatch = input.match(/(\d+)\s*Days?/i);
  const hoursMatch = input.match(/(\d+)\s*Hours?/i);
  const nightsDaysMatch = input.match(/(\d+)\s*Nights?\s*\/\s*(\d+)\s*Days?/i); // "3 Nights/4 Days"
  const nightsMatch = input.match(/(\d+)\s*Nights?/i); // "3 Nights"

  if (nightsDaysMatch) {
    return `${nightsDaysMatch[1]} Nights`; // Extracts only nights
  } else if (nightsMatch) {
    return `${nightsMatch[1]} Nights`; // Extracts only nights
  } else if (daysMatch) {
    return `${daysMatch[1]} Days`; // Extracts only days
  } else if (hoursMatch) {
    return `${hoursMatch[1]} Hours`; // Extracts only hours
  }

  return "Invalid format"; // Default case
}



onMounted(() => {
  if (props.showTimer && isOffered) {
    if (process.client) {
      let animationId
      let lastUpdate = 0
      const update = (timestamp) => {
        if (timestamp - lastUpdate >= 1000) {
          calculateDuration(props.item?.offer_end_date)
          lastUpdate = timestamp
        }
        animationId = requestAnimationFrame(update)
      }
      animationId = requestAnimationFrame(update)

      onBeforeUnmount(() => {
        if (animationId) cancelAnimationFrame(animationId)
      })
    }
  }
})

const likeTour = async () => {
  const token = useCookie('sunpyramids-token').value
  if (!token) {
    toast.error('Please login to like the tour')
  } else {
    await putData(`wishlist/${props.item.id}/toggle`).then(() => {
      isLiked.value = !isLiked.value
      toast.success(isLiked.value ? 'Tour added to wishlist' : 'Tour removed from wishlist')
    }).catch((err) => {
      toast.error(err.data.message)
    })
  }
}

const localePath = useLocalePath()
const router = useRouter()
</script>

<style scoped lang="scss">
.tourCardBox {
  @apply bg-white p-2 pb-4 rounded-3xl border h-[100%] transition-all border-dark/50;

  &:hover {
    @apply border-transparent transition-all duration-300;
    box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.08);
  }
}
</style>
<style lang="scss">
.tourCardSwiper {
  @apply overflow-hidden rounded-2xl h-[12.125rem] relative;

  .swiper-pagination-bullet {
    @apply bg-white w-2 h-2 rounded-full opacity-0 group-hover:opacity-100;
  }

  .swiper-pagination-bullet-active {
    @apply bg-secondary;
  }
}
</style>
