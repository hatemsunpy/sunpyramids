<template>
  <div class="bg-[#ffffff]">
    <AboutUsMainBanner :gallery="aboutData?.gallery" />

    <AboutUsSunPyramids v-if="aboutData" :data="aboutData?.metas.find((meta) => meta.meta_key == 'about-sun-pyramids')"
      :img="aboutData?.feature_1" />

    <AboutUsWhere />

    <AboutUsDistinations v-if="aboutData" :img="aboutData?.feature_2"
      :data="aboutData?.metas.find((meta) => meta.meta_key == 'services')" />

    <AboutUsPartinership />

    <AboutUsPartinershipCertification
      :data="aboutData?.metas.find((meta) => meta.meta_key == 'travel_partner_certification')" />

    <AboutUsGoals :data="aboutData?.metas.filter((meta) => meta.meta_key == 'vision' || meta.meta_key == 'mission')" />

    <div class="bg-[#f9fafb]">
      <HomeParteners />
    </div>

    <AboutUsOurTeam />

    <AboutUsCeoMessage :data="aboutData?.metas.find((meta) => meta.meta_key == 'ceo-message')" />

    <HomeFrequentlyAsked url="faqs?page_limit=5&tag%5B%5D=pages.general&tag%5B%5D=pages.about" path="/faqs" />

    <div class="bg-[#f9fafb]">
      <HomeNeedHelp />

      <HomeGallary />
    </div>
  </div>

  <SharedBottomBar />
</template>

<script setup lang="js">
const { getData } = useApi();
const { addSeo } = useSeo()

const aboutData = ref(null);
const getAboutData = async () => {
  await getData('pages/about-us?includes=seo,metas').then((res) => aboutData.value = res.data).then(() => {
    addSeo(aboutData.value)
  });
};

getAboutData();
</script>

<style scoped lang="scss"></style>
