<template>
  <div class="relative flex gap-3">
    <div class="min-h-full relative " :class="[props.showAfterElement ? 'elementAfter' : '']">
      <div class="min-w-4  min-h-4 mt-5  max-w-4  max-h-4  rounded-full bg-[#1D1F1F] "></div>
    </div>
    <div class="border w-full border-[#eeeeee] rounded-2xl overflow-hidden mb-4">
      <div class="p-4  bg-[#eeeeee] flex justify-between items-center cursor-pointer "
        :class="[isOpen ? '' : 'hover:text-primary hover:bg-[#e9eefc] transition-colors']" @click="isOpen = !isOpen">
        <h6>
          <span class=" font-medium">Day {{ props.index + 1 }} :</span> <span
            v-if="transilationData && transilationData.title">{{ transilationData?.title.split(":")[1] }}</span>
        </h6>

        <NuxtIcon name="arrow-down" class="text-xl w-5 h-5 transition-all" :class="[isOpen ? 'rotate-180 ' : '']" />
      </div>

      <div v-if="isOpen" class="pt-4 mx-5 pb-6 text-[#666666]">
        <!-- <div class="select-none">
          <swiper :spaceBetween="10" :pagination="{ clickable: true }" @slide-change="pause" :navigation="true"
            :thumbs="{ swiper: thumbsSwiper }" :modules="modules" class="tourSwiperDay group ">
            <swiper-slide class="rounded-2xl border w-full min-h-[26.25rem] max-h-[26.25rem] overflow-hidden "
              v-for="item in data"><img v-if="!item.video" :src="item.photo" class="w-full h-full object-cover" />

              <UIVideo :class="'min-h-[26.25rem] max-h-[26.25rem]'" :timeNow="timeNow" v-else :photo="item.photo"
                :video="item.video" />

              <button @click="isOpenModel = true, pause()"
                class="w-[2rem] h-[2rem] bg-[#1D1F1FCC] rounded-full absolute bottom-4 right-4 hover:bg-[#143485] transition-all opacity-0 group-hover:opacity-100 text-white flex justify-center items-center">
                <NuxtIcon name="maximize" />
              </button>
            </swiper-slide>
          </swiper>
        </div> -->

        <div class="mt-" v-html="processTranslation(transilationData)?.description">
        </div>
        <!-- <p class="font-medium text-textDark">Giza Pyramids Complex</p>

        <p class="leading-6">The Giza Pyramids Complex, is home to three of the most famous pyramids:
          the Great Pyramid of Khufu, the Pyramid of Khafre, and the Pyramid of Menkaure. Built between 2580 and 2500
          BCE, these pyramids were constructed as tombs for the pharaohs and are renowned for their massive scale and
          precision. The complex also includes the Great Sphinx, a colossal statue with the body of a lion and the
          head
          of a pharaoh.</p> -->

        <!-- <div>
          <div class="flex gap-2 items-center mt-4">
            <NuxtIcon name="meal" class="text-secondary text-xl w-5 h-5" />

            <p class="text-textDark font-medium ">{{ $t('labels.tours.meal') }}</p>
          </div>

          <div class="pt-2 ps-14 text-[#666666]">
            <ul>
              <li v-for="item in 1" class="list-disc  mb-1">
                Breackfast
              </li>
              <li v-for="item in 1" class="list-disc  mb-1">
                Lunch
              </li>
            </ul>

          </div>
        </div> -->

        <!-- <div>
          <div class="flex gap-2 items-center mt-4">
            <NuxtIcon name="bed" class="text-secondary text-xl w-5 h-5" />

            <p class="text-textDark font-medium ">{{ $t('labels.tours.accommodation') }}</p>
          </div>

          <div class="pt-2 ps-14 pb-6 text-[#666666]">
            <ul>
              <li v-for="item in 1" class="list-disc  mb-1">
                Pyramids Park 4 stars
              </li>
            </ul>

          </div>
        </div> -->
        <!-- 
        <div class="col-span-2">
          <div v-for="item in adds" class="cntr flex gap-2 items-end group w-fit mb-2">
            <input v-model="addsValues" :value="item.id" type="checkbox" :id="item.id" name="catogries"
              class="hidden-xs-up" />
            <label :for="item.id" class="cbx group-hover:border-[#c57007]  checked: transition-colors"></label>
            <label :for="item.id"
              class="font-medium flex gap-10 min-w-72 justify-between  cursor-pointer  group-hover:text-[#c57007] transition-colors"
              :class="[addsValues.includes(item.id) ? 'text-secondary' : 'text-textDark']">{{ item.name }} <p>${{
                item.price }}</p>
            </label>
          </div>
        </div> -->

        <!-- <UISwiperModal @close="isOpenModel = false" v-if="isOpenModel" :data="data" /> -->
      </div>
    </div>

  </div>
</template>

<script setup lang="js">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/pagination";

import { Navigation, Pagination } from 'swiper/modules';
const modules = [Navigation, Pagination];
const isOpen = ref(true)
const isOpenModel = ref(false)
const timeNow = ref(Date.now());
const { locale } = useI18n()

const transilationData = computed(() => {
  return day.value.translations.find((translate) => translate.locale == locale.value)
})

function processTranslation(translation) {
  if (!translation || !translation.description) return translation;

  const mealsMatch = translation.description.match(/Repas\s*:\s*([^<]+)/i);
  const accommodationMatch = translation.description.match(/Hébergements\s*:\s*([^<]+)/i);

  // Convert meals to an array
  const mealsArray = mealsMatch ? mealsMatch[1].split(',').map(meal => meal.trim()) : [];

  // Remove meals and accommodation from description
  let updatedDescription = translation.description
    .replace(/<p>\s*Repas\s*:.*?<\/p>/is, '') // Remove meals
    .replace(/<p>\s*<strong>Hébergements.*?<\/p>/is, '') // Remove accommodations
    .trim();

  return {
    ...translation,
    description: updatedDescription,
    meals: mealsArray.length > 0 ? mealsArray : null,
    accommodation: accommodationMatch ? accommodationMatch[1].trim() : null
  };
}

const addsValues = ref([])

const adds = ref([{ name: "add dinner meal", price: "100", id: "123123156" }, { name: "upgrade to five star", price: "100", id: "1231dfb123156" }, { name: "sound and light show", price: "500", id: "12gfd123156" }])



const props = defineProps({
  time: {
    type: Number
  }, showAfterElement: {
    type: Boolean
  },
  index: {
    type: Number
  },
  day: {
    type: Object
  },
  isClosedAll: {
    type: Boolean,
  }
})

const day = ref(null)
watch(() => props.day, (newVal) => {
  if (newVal) day.value = newVal
}, {
  deep: true,
  immediate: true
})

watch(() => props.isClosedAll, (newVal) => {
  isOpen.value = newVal
})
const pause = () => {
  timeNow.value = Date.now()
}
const data = [{ photo: "/images/tour.png", video: "" }, { photo: "/images/tour.png", video: "/images/test-video.mp4" }, { photo: "/images/tour.png", video: "" }, { photo: "/images/tour.png", video: "/images/test-video.mp4" }, { photo: "/images/tour.png", video: "" }, { photo: "/images/tour.png", video: "/images/test-video.mp4" }, { photo: "/images/tour.png", video: "" }, { photo: "/images/tour.png", video: "/images/test-video.mp4" }, { photo: "/images/tour.png", video: "" }, { photo: "/images/tour.png", video: "/images/test-video.mp4" }, { photo: "/images/tour.png", video: "" }, { photo: "/images/tour.png", video: "/images/test-video.mp4" }, { photo: "/images/tour.png", video: "" }, { photo: "/images/tour.png", video: "/images/test-video.mp4" }, { photo: "/images/tour.png", video: "" }, { photo: "/images/tour.png", video: "/images/test-video.mp4" },]

</script>

<style scoped lang="scss"></style>
<style lang="scss">
.tourSwiperDay {
  @apply mb-2 rounded-2xl overflow-hidden;

  .swiper-pagination-bullet {
    @apply bg-white w-3 h-3 rounded-full opacity-100;
  }

  .swiper-pagination {
    @apply bottom-3;
  }

  .swiper-pagination-bullet-active {
    @apply bg-secondary;
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    @apply bg-[#1D1F1FCC] min-w-11 text-lg min-h-11 me-2 flex items-center justify-center rounded-full text-white;
  }

  .swiper-button-prev::after {
    @apply ms-4;
  }

}

.cbx {
  position: relative;
  top: 1px;
  width: 24px;
  height: 24px;
  border: 2px solid #a5a5a5;
  border-radius: 0.6125rem;
  vertical-align: middle;
  cursor: pointer;
  display: block;
}

.cbx:hover {
  border-color: #c57007;
}

.cbx:after {
  content: "";
  position: absolute;
  top: 2px;
  left: 7px;
  width: 7px;
  height: 12px;
  opacity: 0;
  transform: rotate(45deg) scale(0);
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}

.lbl {
  margin-left: 5px;
  vertical-align: middle;
  cursor: pointer;
}

#cbx:checked~.cbx {
  border-color: transparent;
  background: #f7951d;

  &:hover {
    background-color: #c57007;
    transition: all 0.1s ease;
  }

  @apply group-hover:bg-[#c57007];
}

#cbx:checked~.cbx:after {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.cntr {
  position: relative;
}

.hidden-xs-up {
  display: none !important;
}

.elementAfter {
  @apply after:content-[''] after:min-h-full after:w-[2px] after:bg-[#DEDEDE] after:absolute after:-translate-x-1/2 after:translate-y-9 after:left-1/2 after:top-0;
}
</style>