<template>
  <MakeYourTrip />
</template>

<script setup lang='js'>
const { getData } = useApi()
const { addSeo } = useSeo()

const makeYourTrip = ref(null);

makeYourTrip.value = await getData("pages/make-your-trip?includes=seo").then((res) => {
  return res.data;
});

addSeo(makeYourTrip.value)

</script>

<style scoped lang='scss'></style>