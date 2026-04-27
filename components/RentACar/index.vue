<template>
  <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

  <div class="md:mt-[2.375rem] mb-14 xl:mx-48 md:mx-4 flex flex-col gap-6">
    <SharedStepper title="rentcar" :items="steps" :step="currentStep" :isFromHome="false" @back="currentStep -= 1" />

    <RentACarForm :step="currentStep" @next="currentStep += 1" @getFirstSpte="currentStep = 1" />
  </div>
</template>

<script setup lang="js">
const breadcrumbItems = [{ title: "home", disabled: false, path: "/" }, { title: "rentcar", disabled: true, path: "/rent-car" },]
const steps = ["quickInfo", "personalInfo", "confirmation"]
const route = useRoute()



const currentStep = ref(route.query.type ? 2 : 1)
</script>

<style scoped lang="scss"></style>
