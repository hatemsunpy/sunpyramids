<template>
  <section class="lg:py-16 py-8 xl:px-20 px-4 grid grid-cols-5 lg:gap-44 md:gap-10 gap-6 bg-white">
    <div
      class="lg:col-span-2  col-span-5 flex justify-between items-center bg-[url('/images/mark.svg')] bg-contain bg-no-repeat bg-right ">
      <h3 class="xl:text-5xl md:text-3xl text-xl  font-bold">{{ $t("labels.frequentlyAskedQuestions") }}</h3>

      <div @click="router.push(localePath(props.path))"
        class=" lg:hidden text-base text-primary md:text-lg flex  items-center gap-1  font-medium cursor-pointer">
        <p>{{ $t('labels.seeMore') }}</p>

        <NuxtImg src="/images/line-arrow-right.svg" class="w-4" />
      </div>
    </div>

    <div class="flex flex-col lg:col-span-3 col-span-5 gap-6">
      <template v-if="feqsData.length">
        <HomeFrequentlyAskedAnswer v-for="feq in feqsData" :feq="feq" :key="feq?.id" />

        <div class="lg:block hidden">
          <SharedSeeMore :path="props.path" />
        </div>
      </template>

      <p class="text-center font-medium" v-if="!isLoading && !feqsData.length">There are no frequently asked questions
        :)</p>

      <UILoadingData v-if="isLoading" />
    </div>

  </section>
</template>

<script setup lang="js">
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  path: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['seeMore'])

const feqsData = ref([])
const { getData } = useApi()
const isLoading = ref(true)
feqsData.value = await getData(props.url).then((res) => {
  return res.data.data
})
isLoading.value = false


const router = useRouter()
const localePath = useLocalePath()
</script>

<style scoped lang="scss"></style>
