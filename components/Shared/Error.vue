<template>
  <section class="min-h-96 flex flex-col items-center bg-white justify-center text-center">
    <h1 class="text-[5rem] font-bold mb-2 text-primary">{{ props.status }}</h1>
    <p class=" text-3xl font-medium">{{ props.title }}</p>
    <p v-if="props.description" class="text-sm text-gray-500 mt-2">{{ props.description }}</p>

    <nuxt-link :to="localePath('/')"
      class="px-5 py-3 bg-secondary hover:bg-[#c57007] font-bold text-white shadow-lg cursor-pointer rounded-md mt-10 inline-block text-center mx-auto">
      {{ $t('labels.home') }}
    </nuxt-link>
  </section>
</template>

<script setup lang="js">
const localePath = useLocalePath()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    default: "404"
  }
})
</script>