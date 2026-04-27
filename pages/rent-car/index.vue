<template>
  <RentACar />
</template>

<script setup lang="js">

const { getData } = useApi()
const { addSeo } = useSeo()

const rentCar = ref(null);

rentCar.value = await getData("pages/car-rental?includes=seo").then((res) => {
  return res.data;
});

addSeo(rentCar.value)


</script>

<style scoped lang="scss"></style>
