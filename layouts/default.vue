<template>
  <Header />

  <slot />

  <button @click="goToWhatsApp"
    class="fixed z-40 right-20 bottom-20 w-[60px] h-[60px] gradient-whatsapp b rounded-full lg:flex hidden justify-center items-center">
    <NuxtImg src="/images/whatsapp.png" class="w-10 h-10" />
  </button>

  <HomeChairIcon />
  <Footer />

</template>

<script setup lang="js">
  import {sharedStore} from '~/stores/sharedStore.js'
  const {getCurrancies , getSettings} = sharedStore()
   getCurrancies()
  getSettings()
const goToWhatsApp = () => {
  window.open('https://api.whatsapp.com/send?phone=201095888830', '_blank')
}
</script>

<style scoped lang="scss">
.gradient-whatsapp {
  background: linear-gradient(90deg, #1FAF38 0%, #60D669 100%);
}
</style>
