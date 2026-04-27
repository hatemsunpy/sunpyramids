<template>
  <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />
  <Checkout />
</template>

<script setup lang='js'>
const breadcrumbItems = [{ title: "home", disabled: false, path: "/" }, { title: "cart", disabled: false, path: "/cart" }, { title: "checkout.checkout", disabled: true, path: "/cart" },]

</script>

<style scoped lang='scss'></style>