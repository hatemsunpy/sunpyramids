<template>
  <section class="fixed top-0 start-0 w-full mt-[104px] h-screen z-[9999] lg:hidden block">
    <div class="w-full h-full bg-white">
      <UIText :placeholder="$t('labels.searchPlachholder')" v-model:value="searchQuery"
        :classes="['!rounded-full !py-[16px] !mx-4 mt-2 group']" pre-icon="search" :pre-icon-classes="[
          'text-xl w-5 h-5 text-[#DEDEDE] group-hover:text-[#4d78e5] transition',
        ]" name="title" />

      <div class="pb-4 mx-6 border-b border-b-[#DEDEDE]" v-if="data">
        <div class="py-4 flex gap-2 item-center" v-for="(tour, index) in data.slice(0, 5)" :key="tour.id"
          :class="[index == data.length - 1 ? '' : 'border-b border-b-[#F9FAFB]']" @click="navigateToTour(tour)">
          <NuxtIcon name="search" class="text-2xl text-[#A5A5A5]" />
          <!-- <span>{{ searchQuery }}</span> -->
          <p class=" font-medium"><span v-for="word in getWords(tour)" class=" me-1"
              :class="[searchQuery.toLowerCase().includes(word.toLowerCase()) ? '' : 'text-[#dedede]']">{{ word }}
            </span>
            <span class="text-[#dedede]" v-if="tour?.title.length > 40">...</span>
          </p>
        </div>
        <p v-if="data && data.length > 5" class="text-primary mt-2 text-center cursor-pointer font-medium"
          @click="router.push(localePath(`/trips?title=${searchQuery}`)), isSearchOpen = false">See More</p>

        <p v-if="!data.length" class="mt-3 text-center font-medium"> there are no Tours Found
        </p>
      </div>



      <div class="pb-4 mx-6  border-b-[#DEDEDE]" v-if="sunPyramidsHistory && sunPyramidsHistory.length > 0">
        <div class="py-4 flex gap-2 item-center" v-for="(tour, index) in sunPyramidsHistory" :key="tour.id + 'history'">
          <NuxtIcon name="history" class="text-2xl text-[#A5A5A5]" @click="navigateToTourFromHistory(tour)" />

          <p class=" font-medium"><span class="" @click="navigateToTourFromHistory(tour)">{{
            tour?.title.length > 36 ? tour?.title.slice(0, 36) : tour?.title }}</span><span class=""
              v-if="tour?.title.length > 36">...</span></p>

          <NuxtIcon name="close-circle" @click="RemoveHistory(tour)" class="text-2xl ms-auto cursor-pointer" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang='js'>
const searchQuery = ref('')

const { getData } = useApi()
const router = useRouter()
const localePath = useLocalePath()



const sunPyramidsHistory = useCookie("sunPyramids-search-history")

const data = ref(null)
const isLoading = ref(false)

const getWords = (tour) => {
  const title = tour?.title.length > 40 ? tour?.title.slice(0, 40) : tour?.title
  return title.split(' ')
}

function debounce(func, delay) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

const getTours = async () => {
  data.value = null
  await getData(`tours?title=*${searchQuery.value}*`).then((res) => {
    data.value = res.data.data
  }).catch((err) => {
    console.log(err)
  })
}

const debouncedGetTours = debounce(getTours, 300)

watch(searchQuery, (newVal) => {
  if (newVal) debouncedGetTours()
})

// function stripPartialPrefix(fullText, partial) {
//   const fullLower = fullText.toLowerCase();
//   const partialLower = partial.toLowerCase();

//   if (fullLower.startsWith(partialLower)) {
//     return fullText.slice(partial.length).trim();
//   }
//   return fullText;
// }
const isSearchOpen = useSearchOpenState()


const navigateToTour = (tour) => {
  router.push(localePath(`/tour/${tour?.slug}`))

  const history = sunPyramidsHistory.value || [];

  if (!history.some((item) => item.id === tour.id)) {
    sunPyramidsHistory.value = [
      ...history,
      {
        id: tour.id,
        title: tour.title,
        slug: tour.slug
      }
    ];
  }

  isSearchOpen.value = false;
};
const navigateToTourFromHistory = (tour) => {
  router.push(localePath(`/tour/${tour?.slug}`))
  isSearchOpen.value = false
}

const RemoveHistory = (tour) => {
  const history = sunPyramidsHistory.value || [];

  sunPyramidsHistory.value = history.filter((item) => item.id !== tour.id);
};
</script>

<style scoped lang='scss'></style>