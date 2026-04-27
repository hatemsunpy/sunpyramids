<template>
  <div class="bg-white">
    <BlogsCategoriesMainBanner :image="BlogPage?.banner" />

    <BlogsCategoriesSearchInput v-model:title="title" :isBlogs="true" />


    <div class="flex lg:flex-row flex-col  gap-y-4 justify-between lg:items-start xl:px-20 px-4">
      <div class="w-full flex scroll-container lg:flex-wrap items-center  gap-4">
        <p class="text-textLight">{{ $t("labels.blog.popularTags") }}</p>

        <button v-for="item in catogries" :key="item.id"
          class="px-6 py-2 bg-[#F7F7F7] text-sm hover:bg-[#eeeeee] rounded-full min-w-fit  flex gap-2" :class="[
            selecterBtnsFilter.some((btn) => btn == item)
              ? 'bg-[#e9eefc] text-primary hover:!bg-[#e9eefc]'
              : '',
          ]" @click="filterBtnfn(item)">
          <p>{{ item.title }}</p>

          <img v-if="selecterBtnsFilter.some((btn) => btn == item)" src="/icons/close-circle.svg" alt=""
            class="-me-3 w-5" />
        </button>
      </div>

      <UIOrder @click="order = $event" :items="[{ id: 'asc', name: 'A to Z' }, { id: 'desc', name: 'Z to A' }]"
        title="name" value="id" :classes="[
          'bg-transparent !rounded-full !py-2 flex !focus:outline-none  lg:!w-[8rem] min-w-full !border !border-textLight group transition hover:bg-textDark !hover:text-white',
        ]" :placeholderClasses="[
          '!text-textDark group-hover:!text-white transition font-normal -mt-[1px]',
        ]" :placeholder="$t('labels.sortBy')" name="order" :is-not-full-width="true" />
    </div>

    <section v-if="blogs.length"
      class="xl:px-20 px-4 min-h-[650px] lg:pt-12 pt-4 pb-28 w-full grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-5 gap-y-8">
      <SharedBlogCard v-for="blog in blogs" :key="blog?.id" :blog="blog" />

      <div class="w-full 2xl:col-span-5 xl:col-span-4 lg:col-span-3 md:col-span-2 col-span-1" v-if="isSeeMore">
        <SharedSeeMore @seeMore="page += 1" :isLoading="isLoadingSeeMore" />
      </div>
    </section>

    <section v-if="isLoading" class="w-full min-h-[650px] flex items-center justify-center">
      <UILoadingData />
    </section>


    <section v-if="!blogs.length && !isLoading" class="w-full min-h-[650px] flex items-center justify-center">

      <p class="text-2xl">There are no blogs found :)</p>
    </section>
  </div>

  <HomeFrequentlyAsked url="faqs?page_limit=5&tag%5B%5D=pages.general&tag%5B%5D=pages.blog" path="/faqs" />

  <HomeNeedHelp />

  <HomeParteners :showTitle="false" />

  <SharedBottomBar />
</template>

<script setup lang="js">
const { getData } = useApi()
const { addSeo } = useSeo()
const route = useRoute()
const Blogs = ref([])
const BlogPage = ref(null)
const order = ref("asc")
const isLoading = ref(true)
const page = ref(1)
const isLoadingSeeMore = ref(false)

const isSeeMore = ref(true)

const selecterBtnsFilter = ref([])
const filterBtnfn = (item) => {
  if (selecterBtnsFilter.value.some((btn) => btn == item)) {
    selecterBtnsFilter.value = []
  } else {
    selecterBtnsFilter.value = [item]
  }
}




BlogPage.value = await getData("pages/all-blogs?includes=seo").then((res) => {
  return res.data
})
addSeo(BlogPage.value)



const title = ref(route.query.title ?? "")

const blogs = ref([])
const getBlogs = async () => {
  isLoadingSeeMore.value = true
  if (blogs.value.length == 0) isLoading.value = true
  let query = ["includes=categories,seo&page_limit=10", `&order_by=display_order,${order.value}`, `&page=${page.value}`]
  selecterBtnsFilter.value.forEach(element => {
    if (element.id != "All") query = [...query, `&categories.slug=${element.slug}`]
  });
  if (title.value) query.push(`&title=*${title.value}*`)
  query = query.join("")
  getData(`blogs?${query}`).then((res) => {
    blogs.value = [...blogs.value, ...res.data.data]
    isSeeMore.value = res.data.current_page != res.data.last_page
    isLoadingSeeMore.value = false
    isLoading.value = false
  })
}

const catogries = ref([])
const getCatogries = async () => {
  await getData("blog-categories?page_limit=100").then((res) => {
    catogries.value = [...res.data.data.filter((item => item.id != "36  ")).map((item) => {
      return {
        id: item.id,
        title: item.title,
        slug: item.slug
      }
    })]
    getBlogs()
  })
}
getCatogries()

watch([title, order, selecterBtnsFilter, page], (newVal, oldVal) => {
  if (newVal[3] == oldVal[3]) {
    page.value = 1
    blogs.value = []
  }
  getBlogs()
})
</script>

<style scoped lang="scss"></style>
