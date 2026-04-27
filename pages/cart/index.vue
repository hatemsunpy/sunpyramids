<template>
  <Cart />
</template>

<script setup lang='js'>
const { getData } = useApi()
const { addSeo } = useSeo()

const cartPage = ref(null);

cartPage.value = await getData("pages/cart?includes=seo").then((res) => {
  return res.data;
});

addSeo(cartPage.value)
</script>

<style scoped lang='scss'></style>