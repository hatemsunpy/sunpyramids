<template>
  <Sustainability />

  <div class="w-full xl:px-20" id="home-reviews" ref="trustindexContainer"></div>

  <div class="bg-white">
    <HomeNeedHelp />
  </div>


  <SharedBottomBar />
</template>

<script setup lang='js'>
// TrustIndex is loaded by plugins/third-party-scripts.client.ts when the
// #home-reviews container is present, respecting the ?no-third-party gate.
</script>

<style scoped lang='scss'></style>