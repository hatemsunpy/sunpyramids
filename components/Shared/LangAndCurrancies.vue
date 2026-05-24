<template>
  <button @click="isOpen = true" v-if="props.isAuth"
    class="border  min-h-fit w-fit border-[#EEEEEE] px-4 py-2 rounded-full flex items-center gap-2">
    <NuxtImg class="w-5" src="/icons/language.svg" alt="logo" />

    <span class="font-medium">{{ getLanguage?.language }}</span>
  </button>

  <div v-else @click="isOpen = true"
    class="flex items-center gap-2 hover:bg-dark transition-all px-4 py-2 rounded-full cursor-pointer">
    <NuxtImg class="w-5" src="/icons/language.svg" alt="logo" />

    <span class="font-medium">{{ locale.toLocaleUpperCase() }} - {{ selectedCurrancies?.name ?? "USD" }}</span>
  </div>


  <div v-if="isOpen"
    class="fixed top-0 start-0  z-[9999999] w-full h-screen bg-black/50 flex items-center justify-center">
    <div class="bg-[#FFFFFF] py-6 xl:w-1/3 lg:w-1/2 sm:w-3/4 w-[95%] px-8 rounded-3xl flex flex-col gap-6">
      <div class="w-full flex items-center justify-between">
        <h6 class="text-xl font-medium leading-[160%]">{{ $t('labels.languageAndCurrancies') }}</h6>

        <button @click="isOpen = false"
          class="text-textDark border hover:bg-textDark hover:text-white transition-all border-textDark/30 flex items-center justify-center w-10 h-10 rounded-full">
          <NuxtIcon name="add" class="text-xl rotate-45" />
        </button>
      </div>

      <div>
        <p class="font-medium text-textLight mb-4">{{ $t("labels.currency") }}</p>

        <div class="grid gap-4 grid-cols-2 sm:grid-cols-3">
          <div v-for="c in currancies" :key="`c-${c.id}`" @click="updateCurrancies(c)"
            class="py-2 px-3 cursor-pointer rounded-lg"
            :class="[c.id == selectedCurrancies.id ? 'bg-textDark text-white' : 'hover:text-primary hover:bg-[#f9fafb]']">
            <p class="text-sm mb-2">{{ c.title }}</p>

            <p class="text-sm font-medium">{{ c.symbol }} {{ c.name }}</p>
          </div>
        </div>
      </div>

      <div>
        <p class="font-medium text-textLight mb-4">{{ $t("labels.regionAndLanguage") }}</p>

        <div class="grid gap-4 grid-cols-2 sm:grid-cols-3">
          <NuxtLink v-for="lang in langsConfig" :key="`lang-${lang.code}`" :to="switchLocalPath(lang.code)"
            @click.prevent="switchLocale(lang.code)"
            class="py-2 px-3 cursor-pointer rounded-lg"
            :class="[lang.code == locale ? 'bg-textDark text-white' : 'hover:text-primary hover:bg-[#f9fafb]', isLocaleLoading ? 'pointer-events-none opacity-50' : '']">
            <p class="text-sm mb-2">{{ lang.country }}</p>

            <p class="text-sm font-medium">{{ lang.language }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='js'>
import langsConfig from "../../i18n/Helpers/config";
import { sharedStore } from '~/stores/sharedStore.js'
import { storeToRefs } from 'pinia'

const props = defineProps({
  isAuth: {
    type: Boolean,
    default: false
  }
})

const { locale } = useI18n()
let switchLocalPath = useSwitchLocalePath();

const { currancies, selectedCurrancies } = storeToRefs(sharedStore())
const { updateCurrancies } = sharedStore()
const isOpen = ref(false)
const isLocaleLoading = ref(false)

const getLanguage = computed(() => {
  return langsConfig.find((lang) => lang.code == locale.value)
})

const switchLocale = async (langCode) => {
  if (isLocaleLoading.value) return
  isLocaleLoading.value = true
  try {
    await navigateTo(switchLocalPath(langCode))
  } catch (err) {
    console.error('Locale switch failed:', err)
  } finally {
    isLocaleLoading.value = false
  }
}

</script>

<style scoped lang='scss'></style>