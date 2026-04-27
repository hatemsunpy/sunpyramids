<template>
  <section v-if="relatedBlogs.length" class="xl:px-20 bg-white px-4 pt-10 pb-14 w-full">
    <h4 class="lg:text-[2.125rem] text-2xl mb-8 font-medium">
      {{ $t("labels.blog.relatedBlog") }}
    </h4>

    <div class="w-full grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-5 gap-y-8">
      <SharedBlogCard v-for="blog in relatedBlogs" :key="blog?.id" :blog="blog" />
    </div>
  </section>
</template>

<script setup lang="js">
const { getData } = useApi()
const route = useRoute()
const relatedBlogs = ref([])
relatedBlogs.value = await getData(`blogs?page_limit=5&order_by=display_order,asc&categories.slug=disabled`).then((res) => {
  return res.data.data
})
</script>

<style scoped lang="scss"></style>