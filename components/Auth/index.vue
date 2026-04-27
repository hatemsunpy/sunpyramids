<template>
  <section class="lg:px-8 px-2 grid lg:grid-cols-2 grid-cols-1  h-screen bg-white max-h-screen overflow-y-auto">
    <div
      class="xl:px-[7.5rem] px-[2.5rem] py-8 sm:col-span-1 col-span-2 mx-auto w-full sm:w-3/4 lg:w-full  flex flex-col gap-11">
      <div class="flex justify-between items-start">
        <SharedLangAndCurrancies :is-auth="true" />

        <NuxtLink :to="localePath('/')">
          <NuxtImg src="/images/Artboard 5.png" class="w-20" /> 
        </NuxtLink>
      </div>



      <div class="flex flex-col justify-center !h-full">
        <slot />
      </div>
    </div>

    <div class="max-h-screen sticky lg:block hidden  top-0 overflow-hidden py-8">
      <NuxtImg class="object-cover sticky top-8 rounded-[2.5rem] h-full w-full" src="/images/authHero.png" />
    </div>
  </section>
</template>

<script setup lang="js">
const localePath = useLocalePath()

</script>

<style scoped lang="scss"></style>
