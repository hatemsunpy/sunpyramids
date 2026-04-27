<template>
  <div class="flex lg:flex-row flex-col justify-between items-center w-full">
    <div class="lg:w-fit w-full  lg:mb-0 mb-4">
      <div class="flex gap-1 items-center  min-w-fit">
        <p class="text-[#CCCCCC]">{{ $t("labels.from") }}</p>
        <p>{{ props.from ?? 1 }}</p>
        <p class="text-[#CCCCCC]">{{ $t("labels.to") }}</p>
        <p>{{ props.to ?? 24 }}</p>
        <p class="text-[#CCCCCC]">{{ $t("labels.outOF") }}</p>
        <p>{{ props.total ?? 24 }}</p>
        <p class="text-[#CCCCCC] ">{{ $t("labels.results") }}</p>
      </div>
    </div>

    <div class="!max-w-1/2"><vue-awesome-paginate :total-items="props.total ?? 1" :items-per-page="24"
        :max-pages-shown="getDeviceType" v-model="currentPage"
        @click="onClickHandler">
        <template #starting-breakpoint-button>....</template>
        <template #ending-breakpoint-button>....</template>
        <template #prev-button>
          <UIButton :text="$t(`labels.back`)" pre-icon="arrow-right-pagination"
            :pre-icon-classes="['text-lg !font-normal rotate-180 !text-textDark']" :classes="[
              'border !min-w-fit me-2 hidden lg:flex  gap-2 border-[1px] text-textDark   font-meduim hover:text-white border-textLight hover:bg-textDark',
            ]" />
          <UIButton pre-icon="arrow-right-pagination"
            :pre-icon-classes="['text-lg !font-normal !text-textDark rotate-180']" :classes="[
              'border !w-11 ! h-11 !p-0 !m-0 lg:hidden flex !justify-center lg:gap-2 gap-0 !items-center flex gap-2 border-[1px] text-textDark   font-meduim hover:text-white border-textLight hover:bg-textDark',
            ]" />
        </template>
        <template #next-button>
          <UIButton :text="$t(`labels.next`)" post-icon="arrow-right-pagination"
            :post-icon-classes="['text-lg !font-normal !m-0']" :classes="[
              'border border-primary hidden lg:flex gap-2 border-[1px] hover:bg-[#143485] ms-2 bg-primary font-meduim text-white',
            ]" />
          <UIButton post-icon="arrow-right-pagination" :post-icon-classes="['text-lg !font-normal !m-0']" :classes="[
            'border border-primary  !w-11 ! h-11 !p-0 px-0 lg:hidden flex !m-0 !justify-center !items-center flex lg:gap-2 gap-0 border-[1px] hover:bg-[#143485] ms-2 bg-primary font-meduim text-white',
          ]" />
        </template>
      </vue-awesome-paginate></div>
  </div>
</template>

<script setup lang="js">
const props = defineProps({
  page: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  to: {
    type: Number,
    required: true
  },
  from: {
    type: Number,
    required: true
  },
  pages: {
    type: Number,
    required: true
  }
})
const currentPage = ref(1)
const emits = defineEmits(["update"]);
const onClickHandler = (page) => {
  currentPage.value = page;
  emits("update", page);
};

watch(() => props.page, (val) => {
  currentPage.value = val
})

const windowWidth = ref(0);

const getDeviceType = computed(() => {
  if (windowWidth.value < 768) return 4;
  if (windowWidth.value < 1098) return 3;
  if (windowWidth.value < 1400) return 4;
  if (windowWidth.value < 1290) return 5;
  if (windowWidth.value < 1340) return 7;
  if (windowWidth.value < 1440) return 8;
  return 10;
});

const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener("resize", updateWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});
</script>

<style scoped lang="scss"></style>
