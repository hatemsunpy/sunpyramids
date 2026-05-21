<template>
  <section class="w-full h-[16.6875rem] flex relative items-end ">
    <div class="w-full h-full absolute top-0 categoryBox start-0 " :class="[privacyData ? '' : 'blur-lg']">
      <img class="w-full h-full  object-cover object-top z-0" v-if="feqsData && feqsData.banner"
        :src="feqsData.banner" alt="" loading="lazy" width="1200" height="267" />

      <NuxtImg class="w-full h-full  object-cover object-center z-0" v-else src="/images/faqs-banner.webp" />

      <div class="absolute bottom-0 start-0 w-full h-[70%] categoryBox"></div>
    </div>

    <h3 class="lg:text-[3rem] text-3xl text-white z-10 lg:px-20 px-4 pb-11 font-bold textShadow">
      {{ $t("labels.faqs.banner") }}
    </h3>
  </section>

  <div class="bg-white">
    <section class="lg:px-20 px-4 my-11 pt-8 pb-5">
      <div class="flex items-center gap-4 w-full">
        <UIText v-model:value="searhyQuery" :placeholder="$t('labels.faqs.searchPlaceholder')"
          :classes="['!rounded-full !py-[21px] group']" pre-icon="search" :pre-icon-classes="[
            'text-xl w-5 h-5 text-[#DEDEDE] group-hover:text-[#4d78e5] transition',
          ]" name="title" />

        <!-- <UIButton :classes="[
          '!py-[21px] px-[3.5rem] lg:flex hidden  min-w-fit bg-secondary text-white font-medium hover:bg-[#c57007] h-full',
        ]" :text="$t('labels.search')" type="submit" />
        <UIButton :classes="[
          '!min-w-16 !max-w-16 !min-h-16 !max-h-16 !p-0 min-w-fit lg:!hidden !flex !justify-center !items-center !m-0 !gap-0 bg-secondary text-white font-medium hover:bg-[#c57007] h-full',
        ]" :pre-icon-classes="[
          'text-[1.5rem] w-6 h-6 !text-[#FFFFFF] transition',
        ]" type="submit" pre-icon="search-normal" /> -->
      </div>
    </section>


    <section class="pb-16 w-full min-h-96 lg:px-20 px-4">
      <div class="flex flex-col lg:col-span-3 col-span-5 gap-6">
        <template v-if="filteredFeqs.length">
          <HomeFrequentlyAskedAnswer v-for="feq in filteredFeqs" :feq="feq" :key="feq?.id" />
        </template>

        <p class="text-center font-medium" v-if="!isLoading && !filteredFeqs.length">There are no frequently asked
          questions
          :)</p>

        <UILoadingData v-if="isLoading" />
      </div>
    </section>

    <HomeNeedHelp />
  </div>

  <SharedBottomBar />
</template>

<script setup lang='js'>
const { getData } = useApi()
const searhyQuery = ref("")
const filteredFeqs = computed(() => {
  return feqs.value?.filter((feq) => {
    return feq.question.toLowerCase().includes(searhyQuery.value.toLowerCase())
  })
})


const feqsData = ref(null)
const { addSeo } = useSeo()
feqsData.value = await getData("pages/faqs?includes=seo").then((res) => {
  return res.data
})
addSeo(feqsData.value)
const feqs = ref([])

const isLoading = ref(true)

feqs.value = await getData("faqs?page_limit=200").then((res) => {
  return res.data.data
})
isLoading.value = false




</script>

<style scoped lang='scss'>
.textShadow {
  text-shadow: 0 4px 40px #00000066, 0 4px 24px #00000033;
}

.categoryBox {
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.363),
      rgba(0, 0, 0, 0.726));
}
</style>