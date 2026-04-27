<template>
  <section v-if="plogs.length"
    class="xl:px-20 px-4  pt-12 pb-28 w-full grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-5 gap-y-8">
    <SharedBlogCard v-for="blog in plogs" :key="blog?.id" :blog="blog" />
  </section>

  <section v-else class="w-full min-h-[650px] flex items-center justify-center">
    <UILoadingData />
  </section>
</template>

<script setup lang="js">
const route = useRoute()
const { getData } = useApi()

const plogs = ref([])

const getPlogs = async () => {
  await getData(`blogs?page=1&order_by=display_order,asc&includes=%26categories.slug=${route.params.id}`).then((res) => {
    plogs.value = res.data.data
  })
}

getPlogs()
</script>

<style scoped lang="scss"></style>
