<template>
  <nav class="top-0 w-full z-40 h-fit" :class="[isFixed ? 'fixed' : 'sticky']">
    <div class="header">

      <NuxtImg @click="router.push(localePath('/'))"
        class="xl:min-w-44 xl:max-w-4min-w-44 min-w-32 max-w-32 cursor-pointer" src="/images/logo.png" alt="logo" />

      <ul v-if="isFirstStyle" class="xl:flex hidden items-center justify-between gap-6 font-medium text-base">
        <template v-for="(link, index) in links" :key="index">
          <li v-if="!(link.name == 'rentcar' && isFirstStyle)"
            class="hover:bg-dark transition-all px-4 py-2 rounded-full group">
            <NuxtLink v-if="!link.children" :to="localePath(link.path)">{{
              $t(`labels.${link.name}`)
            }}</NuxtLink>

            <div class="flex items-center gap-2 relative" v-else>
              <span>
                {{ $t(`labels.${link.name}`) }}
              </span>

              <!-- <NuxtImg class="w-5" src="/icons/arrow-down.svg" alt="logo" /> -->
              <NuxtIcon name="arrow-down" class="w-5 h-5 text-xl" />
              <ul
                class="absolute  -left-4 text-base bg-white dropDownShadow rounded-b-2xl px-4 py-2 w-56 invisible group-hover:visible transition-all duration-200 z-30"
                style="top: calc(100% + 1rem)">
                <li v-for="(c, i) in link.children" :key="i"
                  class="hover:text-primary group/link hover:bg-third transition px-4 py-2 rounded-lg">
                  <NuxtLink :to="localePath(c.path)" class="flex items-center justify-between">
                    <span>{{ $t(`labels.${c.name}`) }}</span>

                    <img class="w-5 opacity-0 group-hover/link:opacity-100 transition-opacity"
                      src="/images/Line arrow-right.png" alt="logo" />
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </li>
        </template>
      </ul>

      <form @submit.prevent="submitSearch" v-else
        class="border hidden  lg:flex border-third/50 p-4 rounded-full w-1/2  items-center gap-2 inputContiner">
        <NuxtIcon name="search" class="text-xl text-dark w-5 h-5" />

        <input type="text" v-model="searchQuery" :placeholder="$t('labels.searchPlachholder')"
          class="font-medium placeholder:text-textLight w-full" />
      </form>

      <div class="flex items-center gap-2 min-w-fit">
        <div class="hidden  lg:flex">
          <SharedLangAndCurrancies />
        </div>

        <button v-if="!isSearchOpen" @click="isSearchOpen = true"
          class="px-[6px] h-11 gap-1 justify-center items-center lg:hidden flex group border-[1px] border-dark/50 rounded-full hover:bg-textDark hover:border-textDark transition-all cursor-pointer hover:text-white">
          <NuxtIcon name="search-normal" class="text-[1.25rem] !font-normal" />
          <p class="text-xs">Discover</p>
        </button>

        <button v-if="!isSearchOpen" @click="router.push(localePath('/cart'))"
          class="h-11 w-11 justify-center items-center flex group border-[1px] border-dark/50 rounded-full hover:bg-textDark hover:border-textDark transition-all cursor-pointer hover:text-white">
          <NuxtIcon name="cart" class="text-[1.25rem]" />
        </button>

        <UIButton v-if="!isLogin" :text="$t(`labels.signIn`)" :classes="[
          'border  border-[1px] hidden lg:flex  font-meduim hover:text-white',
          isFirstStyle
            ? 'border-primary hover:bg-primary'
            : 'border-textDark hover:bg-textDark',
        ]" @click="router.push(localePath('/auth/sign-in'))" />

        <div class="hidden lg:flex" v-else>
          <HeaderLoginComponent />
        </div>

        <button v-if="!isSearchOpen" @click="isModelOpened = true"
          class="h-11 w-11 justify-center  items-center flex lg:hidden group border-[1px] border-dark/50 rounded-full hover:bg-textDark hover:border-textDark transition-all cursor-pointer hover:text-white">
          <NuxtIcon name="bar" class="text-[1.25rem]" />
        </button>
        <button v-if="isSearchOpen" @click="isSearchOpen = false"
          class="h-11 w-11 justify-center  items-center flex lg:hidden group border-[1px] border-dark/50 rounded-full hover:bg-textDark hover:border-textDark transition-all cursor-pointer hover:text-white">
          <NuxtIcon name="add" class="text-[1.25rem] rotate-45 !text-3xl" />
        </button>
      </div>
    </div>


    <div v-if="localePath('/') == route.path"
      class="w-full bg-primary relative mt-[0.5px] py-4 px-4 2xl:px-20 xl:px-8  items-center 2xl:gap-14 xl:gap-6 justify-between flex-col lg:flex-row text-center gap-2"
      :class="[isFirstStyle ? 'flex' : 'hidden md:hidden lg:top-[2.875rem]']">

      <div class="flex items-center gap-2 ">
        <NuxtImg src="/images/clover.png" class="w-6 h-6" />

        <NuxtImg src="/images/easter-egg.png" class="w-8 h-8" />
      </div>

      <p class="text-white font-medium text-xl z-10">{{ $t('labels.strip.title') }}</p>

      <UIButton @click="router.push(localePath('/egypt-tours/multi-days-tours/easter-packages'))" type="button" :loading="isLoading" :classes="[
        'py-3 !px-12 min-w-fit gap-2  !justify-center bg-secondary  text-base font-medium hover:bg-[#c57007] text-white font-meduim hover:text-white',
      ]" :text="$t('labels.strip.btn')" />
      <!-- <SharedIceFalling  :iceCount="20"/> -->
    </div>

  </nav>



  <nav class="secondHeader" :class="[isFixed ? 'fixed' : 'sticky']" v-if="!isFirstStyle">
    <div>
      <ul class="flex items-center justify-between gap-2 font-medium text-base">
        <li v-for="(link, index) in links" :key="index"
          class="hover:bg-dark transition-all px-4 py-2 rounded-full group">
          <NuxtLink v-if="!link.children" :to="localePath(link.path)">{{
            $t(`labels.${link.name}`)
          }}</NuxtLink>

          <div class="flex items-center gap-2 relative" v-else>
            <span>
              {{ $t(`labels.${link.name}`) }}
            </span>

            <NuxtIcon name="arrow-down" class="w-5 h-5 text-xl" />

            <ul
              class="absolute -left-4 text-base bg-white dropDownShadow rounded-b-2xl px-4 py-2 w-56 invisible group-hover:visible transition-all duration-200"
              style="top: calc(100% + 1rem)">
              <li v-for="(c, i) in link.children" :key="i"
                class="hover:text-primary group/link hover:bg-third transition px-4 py-2 rounded-lg">
                <NuxtLink :to="localePath(c.path)" class="flex items-center justify-between">
                  <span>{{ $t(`labels.${c.name}`) }}</span>

                  <img class="w-5 opacity-0 group-hover/link:opacity-100 transition-opacity"
                    src="/images/Line arrow-right.png" alt="logo" />
                </NuxtLink>
              </li>
            </ul>
          </div>
        </li>

        <li class="font-medium text-base hover:bg-[#e9eefc] transition-all px-4 py-2 rounded-full">
          <NuxtLink class="text-secondary flex items-center gap-2" :to="localePath('/trips?main=special-offers')">
            <NuxtIcon name="discount" class="text-xl" />

            <span>{{ $t(`labels.spaicalOffer`) }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <UIButton :text="$t(`labels.makeYourTrip`)" :classes="[
      'border border-primary border-[1px] hover:bg-primary font-meduim hover:text-white',
    ]" @click="router.push(localePath('/make-your-trip'))" />
  </nav>

  <!-- <div v-if="route.fullPath != localePath('/event/egypt-christmas-event-2025')"
    class="fixed -translate-x-1/2 start-1/2 md:-top-[10px] sm:top-[36px] top-[52px] transition-all duration-700 sm:w-fit w-3/4 z-[31]"
    :class="[isFirstStyle ? 'xl:hover:top-[5.2125rem] lg:hover:top-[4.8125rem] md:hover:top-[5.9125rem] hover:top-[6.8125rem] tree' : !isFirstStyle && !isMobile ? 'xl:top-[8.9rem] lg:top-[8.5rem] md:top-[5.9125rem] top-[6.8125rem]' : !isFirstStyle && isMobile ? 'xl:hover:top-[5.2125rem] lg:hover:top-[4.8125rem] md:hover:top-[5.9125rem] hover:top-[6.8125rem] tree' : '']">
    <NuxtImg src="/images/cri-container.png" class="!w-[460px]" />

    <NuxtLink :to="localePath('/event/egypt-christmas-event-2025')"
      class="absolute sm:top-8 top-6 start-1/2 -translate-x-1/2 -translate-y-1/2 md:text-lg text-sm  text-center font-medium">
      {{ $t("labels.bookCriTrip") }}
    </NuxtLink>
  </div> -->

  <div v-if="isModelOpened" @click.self="isModelOpened = false"
    class="fixed top-0 left-0 w-full z-[9999] h-screen flex justify-end bg-black/50">
    <div class="bg-white w-[80%] py-10 px-4">

      <div class="flex items-center justify-between mb-6">
        <NuxtImg class="xl:min-w-60 xl:max-w-60 min-w-40 max-w-40 mb-6 cursor-pointer"
          @click="router.push(localePath('/')), isModelOpened = false" src="/icons/logo.svg" alt="logo" />

        <UIButton :text="$t(`labels.signIn`)" v-if="!isLogin" :classes="[
          'border  border-[1px]  font-meduim hover:text-white',
          isFirstStyle
            ? 'border-primary hover:bg-primary'
            : 'border-textDark hover:bg-textDark',
        ]" @click="router.push(localePath('/auth/sign-in')), isModelOpened = false" />

        <div class="" v-else>
          <HeaderLoginComponent @closeModel="isModelOpened = false" />
        </div>
      </div>


      <ul class="flex flex-col  items-start  justify-center w-full gap-4 font-medium text-base">
        <div v-for="(link, index) in linksMobile" :key="index" class="w-full">
          <li class="hover:bg-dark transition-all px-4 py-2 w-full rounded-full group">
            <p class="w-full !block cursor-pointer"
              @click="isModelOpened = !link.children ? false : true, router.push(localePath(link.path))"
              v-if="!link.children">
              {{
                $t(`labels.${link.name}`)
              }} </p>

            <div class="flex items-center justify-between gap-2 relative w-full"
              @click="IsOpenEfyptTourMobilde = !IsOpenEfyptTourMobilde" v-else>
              <span>
                {{ $t(`labels.${link.name}`) }}
              </span>

              <NuxtIcon name="arrow-down" class="w-5 h-5 text-xl" />

              <ul v-if="IsOpenEfyptTourMobilde"
                class="absolute  -left-4 text-base w-full bg-white dropDownShadow rounded-b-2xl px-4 py-2  transition-all duration-200"
                style="top: calc(100% + 1rem)">
                <li @click="isModelOpened = false" v-for="(c, i) in link.children" :key="i"
                  class="hover:text-primary group/link hover:bg-third transition px-4 w-full py-2 rounded-lg">
                  <NuxtLink :to="localePath(c.path)" class="flex items-center justify-between">
                    <span>{{ $t(`labels.${c.name}`) }}</span>

                    <img class="w-5 opacity-0 group-hover/link:opacity-100 transition-opacity"
                      src="/images/Line arrow-right.png" alt="logo" />
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </li>
        </div>
        <li @click="isModelOpened = false" class="hover:bg-dark transition-all px-4 py-2 w-full rounded-full group">
          <NuxtLink class="text-secondary flex items-center gap-2" :to="localePath('/trips?main=special-offers')">
            <NuxtIcon name="discount" class="text-xl" />

            <span>{{ $t(`labels.spaicalOffer`) }}</span>
          </NuxtLink>
        </li>
      </ul>

      <div class="w-fit mt-10  mx-auto border rounded-full">
        <SharedLangAndCurrancies />
      </div>
    </div>
  </div>


  <SharedMobileSearch v-if="isSearchOpen" />
</template>

<script setup lang="js">


const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()
const scrollExceeded = ref(true)
import { sharedStore } from '~/stores/sharedStore.js'

const { getnationalities } = sharedStore()
await getnationalities()
const isSearchOpen = useSearchOpenState()

const isLogin = computed(() => {
  return useCookie('sunpyramids-token').value
})


const specialPath = [localePath('/blog')]
const searchQuery = ref(route.query.title ?? "")
const IsOpenEfyptTourMobilde = ref(false)
const isModelOpened = ref(false)
const isFirstStyle = computed(() => {
  return (route.path == localePath('/') && scrollExceeded.value)
})

const screanHeight = ref(1080)

const isMobile = ref(false)

const isFixed = computed(() => {
  return (route.path == localePath('/'))
})

const handleScrollY = () => {
  if(isMobile){
    scrollExceeded.value = window.scrollY < window.innerHeight-440;
  }else{
    scrollExceeded.value = window.scrollY < window.innerHeight;
  }
  }

const submitSearch = () => {
  if (searchQuery.value) router.push(localePath(`/trips?title=${searchQuery.value}`))
}

watch(() => route.query.title, (newVal) => {
  searchQuery.value = newVal
})

onMounted(() => {
  window.addEventListener('scroll', handleScrollY);
  isMobile.value = window.innerWidth < 512
  screanHeight.value = window.innerHeight;
  console.log("Screen height:", screanHeight.value);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScrollY);
});

const links = [{ name: "home", path: "/" },
{
  name: "egyTours", path: null, children: [
    { name: "oneDay", path: "/egypt-tours/one-day-tours" },
    { name: "multiDays", path: "/egypt-tours/multi-days-tours" },
    { name: "nileCruises", path: "/egypt-tours/nile-cruises" },
    { name: "shoreExsurision", path: "/egypt-tours/shore-excursions" }
  ]
},
{ name: "rentcar", path: "/rent-car" },
{ name: "about", path: "/about-us" },
{ name: "contact", path: "/contact-us" },
{ name: "blogs", path: "/blogs/all-blogs" },
{ name: "events", path: "/events" }
]
const linksMobile = [{ name: "home", path: "/" },
{
  name: "egyTours", path: null, children: [
    { name: "oneDay", path: "/egypt-tours/one-day-tours" },
    { name: "multiDays", path: "/egypt-tours/multi-days-tours" },
    { name: "nileCruises", path: "/egypt-tours/nile-cruises" },
    { name: "shoreExsurision", path: "/egypt-tours/shore-excursions" }
  ]
},
{ name: "rentcar", path: "/rent-car" },
{ name: "makeYourTrip", path: "/make-your-trip" },
{ name: "about", path: "/about-us" },
{ name: "contact", path: "/contact-us" },
{ name: "blogs", path: "/blogs/all-blogs" },
{ name: "events", path: "/events" }
]



</script>

<style scoped lang="scss">
.header {
  @apply headerBlur py-4 pt-12 lg:pt-4 px-4 2xl:px-20 xl:px-8 flex items-center 2xl:gap-14 xl:gap-6 justify-between border-b-[1px] border-[#F9FAFB] w-full;
}

.secondHeader {
  @apply headerBlur py-1 px-1 2xl:px-20 xl:px-4 hidden lg:flex items-center 2xl:gap-14 xl:gap-0 xl:text-base text-xs justify-between border-b-[1px] border-[#F9FAFB] top-[5.7185rem] w-full z-40;
}



.dropDownShadow {
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.095);
}

.headerBlur {
  background-color: rgba(255, 255, 255, 0.98);
}

.filterCart {
  color: white;
  fill: white;
  stroke: white;
}

.search-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #007bff;
  /* Icon color */
}

input {
  border: none;
  outline: none;

  &:focus~.inputContiner {
    @apply bg-black;
  }
}

.inputContiner {
  @apply bg-white;
}

.inputContiner:hover {
  border-color: #4d78e5;
}

.inputContiner:focus-within {
  border-color: #4d78e5;
  box-shadow: 0px 0px 0px 4px #e9eefc;
}

// .tree{
//   transform: translateX(-50%) !important;
// }

.tree:not(:hover) {
  animation: sway 3s ease-in-out infinite;
  transform-origin: left center;
}

@keyframes sway {

  0%,
  70%,
  100% {
    transform: rotate(0deg) translate(-50%);
  }

  72% {
    transform: rotate(3deg) translate(-50%);
  }

  76% {
    transform: rotate(-3deg) translate(-50%);
  }

  78% {
    transform: rotate(3deg) translate(-50%);
  }

  80% {
    transform: rotate(-3deg) translate(-50%);
  }

  84% {
    transform: rotate(3deg) translate(-50%);
  }

  86% {
    transform: rotate(-3deg) translate(-50%);
  }

  88% {
    transform: rotate(3deg) translate(-50%);
  }

  92% {
    transform: rotate(-3deg) translate(-50%);
  }

  96% {
    transform: rotate(3deg) translate(-50%);
  }

  98% {
    transform: rotate(-3deg) translate(-50%);
  }
}
</style>
