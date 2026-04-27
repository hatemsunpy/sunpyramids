<template>
  <section
    class="fixed  submitBoxShadow bottom-0 z-50 pb-[26px] start-0 w-full py-[6px] lg:hidden flex justify-between items-center px-5 bg-[#ffffff]">
    <div class="flex gap-4">
      <div class="flex flex-col items-center gap-2 px-3 cursor-pointer"
        @click="router.push(localePath('/trips?main=special-offers'))">
        <img src="../../assets/icons/discount-bottom.png" class="text-secondary" />

        <p class="text-sm">Offers</p>
      </div>

      <div class="flex flex-col items-center gap-2 px-3 cursor-pointer"
        @click="router.push(localePath('/make-your-trip'))">
        <img src="../../assets/icons/trip-bottom.png" class="text-secondary" />

        <p class="text-sm">Make Trip</p>
      </div>
    </div>


    <div class="flex gap-4">
      <div class="flex flex-col items-center gap-2 px-3 cursor-pointer" @click="router.push(localePath('/trips'))">
        <img src="../../assets/icons/airplane-bottom.png" class="text-secondary" />

        <p class="text-sm">trips</p>
      </div>

      <div class="flex flex-col items-center gap-2 px-3 cursor-pointer" @click="router.push(localePath('/'))">
        <img v-if="localePath('/') == route.fullPath" src="../../assets/icons/home-bottom.png" class="text-secondary" />

        <img v-else src="../../assets/icons/home-bottom-nonfill.png" class="text-secondary" />

        <p class="text-sm  " :class="[localePath('/') == route.fullPath ? 'text-secondary font-medium' : '']">Home</p>
      </div>
    </div>

    <button @click="goToWhatsApp"
      class="absolute start-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-14 h-14 gradient-whatsapp b rounded-full flex justify-center items-center">
      <NuxtImg src="/images/whatsapp.png" class="w-8 h-8" />
    </button>
  </section>
</template>

<script setup lang='js'>
const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()
const isSearchOpen = useSearchOpenState()

const updateSharchShow = () => {
  isSearchOpen.value = !isSearchOpen.value
}

const goToWhatsApp = () => {
  window.open('https://api.whatsapp.com/send?phone=201095888830', '_blank')
}
</script>

<style scoped lang='scss'>
.gradient-whatsapp {
  background: linear-gradient(90deg, #1FAF38 0%, #60D669 100%);
}
</style>