<template>
  <div class="tourCardBox h-full justify-between group">
    <div>
      <NuxtLink :to="localePath(`/blog/${props.blog.slug}`)" :prefetch="false">

        <!-- @click="router.push({
          name: `blog-slug___${locale}`, // Now correct
          params: { slug: props.blog.slug }
          })" -->
        <div class="h-[12.0625rem] cursor-pointer rounded-[1.1rem] overflow-hidden">
          <img class="w-full h-full object-cover group-hover:scale-125 transition-all duration-300"
            :src="props.blog.featured_image" alt="BlogCard" loading="lazy" width="400" height="193" />
        </div>
      </NuxtLink>
      <div class="mt-4 px-2 flex flex-col gap-2">
        <div class="flex items-center gap-1 flex-wrap">
          <template v-if="props.blog.tags && props.blog.tags.split(',').length > 1">
            <p v-for="item in props.blog.tags.split(',').slice(0, 1)" :key="item"
              class="text-sm text-[#945405] px-2 py-1 bg-[#fef3e6] w-fit rounded-full">
              {{ item }}
            </p>
          </template>

          <p v-if="props.blog.tags && props.blog.tags.split(',').length > 1"
            class="text-sm text-[#945405] px-2 py-1 bg-[#fef3e6] w-fit rounded-full">
            +{{ props.blog.tags.split(',').length - 1 }} more
          </p>
        </div>

        <NuxtLink :to="localePath(`/blog/${props.blog.slug}`)" :prefetch="false">
          <h6 @click="router.push(`/blog/${id}`)" class="text-base h-[4.25rem] cursor-pointer font-medium">
            {{ props.blog.title }}
          </h6>
        </NuxtLink>
      </div>
    </div>


    <!-- <div class="flex justify-between items-end">
      <div class="flex items-center gap-[6px] py-1 rounded-full">
        <NuxtIcon name="clock" class="text-[18px] w-[18px] h-[18px] text-[#A5A5A5] mb-0" />

        <p class="my-0 text-sm text-[#666666]">{{ formatDate(props.blog.created_at) }}</p>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="js">
const props = defineProps({
  blog: {
    type: Object,
    default: {}
  }
})

const localePath = useLocalePath()
const { locale } = useI18n()
const router = useRouter()
function formatDate(isoString) {
  const date = new Date(isoString);

  // Define month names
  const options = { day: "2-digit", month: "short", year: "numeric" };

  return date.toLocaleDateString("en-GB", options); // Example: "12 Feb 2025"
}
</script>

<style scoped lang="scss">
.tourCardBox {
  @apply bg-white p-2 pb-4 flex flex-col rounded-3xl border transition-all border-dark/50;

  &:hover {
    @apply border-transparent transition-all duration-300;
    box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.08);
  }
}
</style>
