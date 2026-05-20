<template>
  <section class="w-full h-[20.5rem] relative bg-cover bg-center overflow-hidden bg-no-repeat">
    <div class=" bg-transparent">
      <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />
    </div>

    <img class="w-full h-full  object-cover object-center z-0" :src="props.data?.featured_image" />


    <div class="absolute linearBG right-0 bottom-0  w-full flex items-center pb-[2.625rem] h-[60%]">
      <div class="text-white text-center w-full font-medium textShadow">
        <h4 class="text-[2.125rem] leading-[46.57px]">
          {{ $t("labels.blogs") }}
        </h4>

        <h1 class="text-5xl leading-[65.74px]">{{ props.data?.title }}</h1>
      </div>
    </div>
  </section>
</template>

<script setup lang="js">
const route = useRoute()
const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})

const breadcrumbItems = ref([{ title: "home", disabled: false, path: "/" }, { title: "blogs", disabled: false, path: "/egypt-travel-guide" },])

function kebabToTitle(str) {
  return str
    .split('-') // Split by hyphen
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' '); // Join back with spaces
}

if (route.params.id) {
  breadcrumbItems.value = [...breadcrumbItems.value, { title: kebabToTitle(route.params.cate), directTitle: true, disabled: false, path: `/egypt-travel-guide/${route.params.cate}` }]
}
const page = ref(null)

watch(() => props.data, (value) => {
  page.value = value
  breadcrumbItems.value.push({ title: page.value.title, directTitle: true, disabled: true, path: `` })
})

</script>

<style scoped lang="scss">
.linearBG {
  background: linear-gradient(to top,
      #000000af 0%,
      #00000000 80%,
      #00000000 100%);
}

.textShadow {
  text-shadow: 0px 4px 40px #00000066, 0px 4px 24px #00000033;
}
</style>
