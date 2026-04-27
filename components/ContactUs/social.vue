<template>
  <section v-if="settings" class="py-14 xl:px-20 px-4 grid lg:grid-cols-4 grid-cols-2 xl:gap-10 md:gap-4 gap-2 justify-between">
    <button @click="getURL(item.value)" v-for="(item, index) in socials" :key="index"
      class="flex gap-2 py-4 w-full hover:bg-[#d19026] hover:border-[#d19026] duration-300 transition-colors px-10 items-center justify-center border border-[#CCCCCC] rounded-2xl">
      <NuxtImg :src="`/icons/${item.icon}.png`" class="min-h-6 min-w-6 max-w-6 max-h-6 " />

      <span class="font-medium">{{ item.title }}</span>
    </button>
  </section>

  <UILoadingData v-else />
</template>

<script setup lang="js">
import { storeToRefs } from 'pinia'
import { sharedStore } from '~/stores/sharedStore.js'

const { settings } = storeToRefs(sharedStore())
const socials = [{ title: "Youtube", icon: "youtube", value: "youtube" }, { title: "Google", icon: "g-plus", value: "google-plus" }, { title: "Facebook", icon: "facebook", value: "facebook" }, { title: "Instagram", icon: "instagram", value: "instagram" }]


const getURL = (val) => {
  window.open(settings.value.find(setting => setting.option_key == 'social_links').option_value.find(ele => ele.type == val).url, "_blank")
}
const router = useRouter()
</script>

<style scoped lang="scss"></style>
