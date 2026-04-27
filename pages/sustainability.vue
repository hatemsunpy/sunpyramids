<template>
  <Sustainability />

  <div class="w-full xl:px-20" id="home-reviews" ref="trustindexContainer"></div>

  <div class="bg-white">
    <HomeNeedHelp />
  </div>


  <SharedBottomBar />
</template>

<script setup lang='js'>
const trustindexContainer = ref(null);


onMounted(() => {
  // Check if running on client side
  if (process.client) {
    const script = document.createElement('script');
    script.src = 'https://cdn.trustindex.io/loader.js?1d15b034519c8049128609a4d4e';
    script.async = true;
    script.defer = true;

    // Add data attributes if needed by TrustIndex
    script.setAttribute('data-type', 'stripe');
    script.setAttribute('data-location', 'home-reviews');

    trustindexContainer.value.appendChild(script);
  }
});
</script>

<style scoped lang='scss'></style>