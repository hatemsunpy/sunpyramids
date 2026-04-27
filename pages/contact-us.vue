<template>
  <div class="bg-white">
    <ContactUsMainBanner :data="contactData" />

    <ContactUsInformations :data="contactData" />

    <ContactUsForm />

    <ContactUsSocial />

    <HomeFrequentlyAsked url="faqs?page_limit=5&tag%5B%5D=pages.general&tag%5B%5D=pages.contact" path="/faqs" />

    <div class="bg-[#f9fafb]">
      <HomeNeedHelp />
    </div>
  </div>

  <SharedBottomBar />
</template>

<script setup lang="js">
const { getData } = useApi();
const { addSeo } = useSeo()

const contactData = ref(null);
const getContactData = async () => {
  await getData('pages/contact-us?includes=seo').then((res) => contactData.value = res.data).then(() => {
    addSeo(contactData.value);
  });
};

getContactData();
</script>

<style scoped lang="scss"></style>
