<template>
  <section v-if="route.params.cate" class="lg:px-20 px-4 min-h-[600px]">

    <div v-if="catogries">
      <div v-if="catogries?.children.length" class="py-14 grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        <div v-for="item in catogries?.children" :key="item.id"
          class="w-full h-56 rounded-2xl cursor-pointer categoryBox relative overflow-hidden group">
          <NuxtLink
            :to="route.params.cate ? localePath(`/egypt-travel-guide/${route.params.cate}/${item?.slug}`) : localePath(`/egypt-travel-guide/${item?.slug}`)">
            <img class="w-full h-full group-hover:scale-110 transition-all" :src="item?.featured_image" loading="lazy" :alt="item?.title || 'Category image'" />
  
            <div class="h-[80%] w-full absolute bottom-0 start-0 flex items-end">
              <span class="text-white textShadow px-[2.125rem] group-hover:-translate-y-2 transition-all mb-4">
                <h5 class="mb-1 text-2xl">{{ item?.title }}</h5>
  
                <p class="text-lg">6 blog</p>
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <section v-if="catogries?.blogs.length"
        class=" pt-12 pb-28 w-full grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-5 gap-y-8">
        <SharedBlogCard v-for="blog in catogries?.blogs" :key="blog?.id" :blog="blog" />
      </section>
    </div>


    <div v-else class="py-14 items-center justify-center flex">
      <UILoadingData />
    </div>
  </section>

  <section v-else class="lg:px-20 px-4 min-h-[600px]">
    <div v-if="catogries &&catogries.length" class="py-14 grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
      <div v-for="item in catogries"
        class="w-full h-56 rounded-2xl cursor-pointer categoryBox relative overflow-hidden group">
        <NuxtLink
          :to="route.params.cate ? localePath(`/egypt-travel-guide/${route.params.cate}/${item?.slug}`) : localePath(`/egypt-travel-guide/${item?.slug}`)">
          <img class="w-full h-full group-hover:scale-110 transition-all" :src="item?.featured_image" loading="lazy" :alt="item?.title || 'Category image'" />

          <div class="h-[80%] w-full absolute bottom-0 start-0 flex items-end">
            <span class="text-white textShadow px-[2.125rem] group-hover:-translate-y-2 transition-all mb-4">
              <h5 class="mb-1 text-2xl">{{ item?.title }}</h5>

              <p class="text-lg">6 blog</p>
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>


    <div v-else class="py-14 items-center justify-center flex">
      <UILoadingData />
    </div>
  </section>
</template>

<script setup lang="js">
const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()
const filterBtn = ["All", "Day Tours", "Half Day Tour", "Night Tours", "Layover"]
const selecterBtnsFilter = ref([])
const { getData } = useApi()

const filterBtnfn = (item) => {
  if (selecterBtnsFilter.value.some((btn) => btn == item)) {
    if (item == "All") {
      selecterBtnsFilter.value = []
    } else {
      if (selecterBtnsFilter.value.some((btn) => btn == "All")) selecterBtnsFilter.value = selecterBtnsFilter.value.filter((btn) => btn != "All")

      selecterBtnsFilter.value = selecterBtnsFilter.value.filter((btn) => btn != item)
    }
  } else {
    if (item == "All") {
      selecterBtnsFilter.value = filterBtn
    } else {
      selecterBtnsFilter.value = [...selecterBtnsFilter.value, item]
    }
  }
}

const catogries = ref(null)
const props = defineProps({
  id: Number
})
const getBlogCatogries = async (id) => {
  const url = route.params.cate ? `blog-categories/${id}?page=1` : `blog-categories?page=1&parent_id=%5Bnull%5D`
  getData(url).then((res) => {
    console.log(res.data)
    catogries.value = route.params.cate ? res.data : res.data.data
  })
}

watch(() => props.id, (val) => {
  if (val) getBlogCatogries(val)
})
</script>

<style scoped lang="scss">
.textShadow {
  text-shadow: 0px 2px 4px #00000040;
}

.categoryBox {
  div {
    background: linear-gradient(to top,
        #00000099 0%,
        #00000000 40%,
        #00000000 100%);
  }

  &:hover>div {
    @apply transition-all;
    background: linear-gradient(to top,
        #000000cc 0%,
        #00000000 70%,
        #00000000 100%);
  }
}
</style>
