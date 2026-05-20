<template>
  <section
    class="w-full text-center text-white relative bg-no-repeat bg-cover xl:pt-20 md:pt-10 pt-[4rem] md:pb-[4.5rem] pb-[6rem] overflow-hidden">
    <div>
      <img :src="data?.banner" class="absolute z-[1]  object-cover w-full top-0 start-0 " />

      <h1 class="xl:text-5xl md:text-4xl text-3xl relative !z-10 textshadow font-bold mb-5">
        {{ $t("labels.contact") }}
      </h1>



      <h3 class="xl:text-4xl md:text-2xl text-xl relative !z-10 textshadow font-medium">{{ $t("labels.contactus.hero") }}</h3>
    </div>
  </section>
</template>

<script setup lang="js">
const props = defineProps({
  data: Object,
  default: {}
})
</script>

<style scoped lang="scss">
.textshadow {
  text-shadow: 0px 4px 40px rgba(0, 0, 0, 0.4), 0px 4px 24px rgba(0, 0, 0, 0.2);
}
</style>
