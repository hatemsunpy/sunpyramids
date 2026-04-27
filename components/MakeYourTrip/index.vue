<template>
  <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

  <div class="md:mt-[2.375rem] mb-14 xl:mx-48 md:mx-4 flex flex-col gap-6">
    <SharedStepper title="makeYourTrip" :items="steps" :step="currentStep" :isFromHome="false"
      @back="currentStep -= 1" />

    <MakeYourTripForm :step="currentStep" @next="currentStep += 1" @getFirstSpte="currentStep = 1" />
  </div>
</template>

<script setup lang="js">
const breadcrumbItems = [{ title: "home", disabled: false, path: "/" }, { title: "makeYourTrip", disabled: true, path: "/make_your_trip" },]
const steps = ["quickInfo", "personalInfo", "confirmation"]
const route = useRoute()

const currentStep = ref(route.query.type ? 2 : 1)
</script>

<style scoped lang="scss"></style>
