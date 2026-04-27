<template>
  <section class="md:py-6 md:px-10 py-4 px-4 pe-0 bg-white md:rounded-2xl">
    <div class="md:flex hidden items-center gap-4" @click="back">
      <NuxtImg src="/icons/arrow-left.png"
        class="p-3 min-w-5 min-h-5 hover:bg-dark transition-colors rounded-full cursor-pointer" />

      <h5 class="text-2xl font-medium">{{ $t("labels." + props.title) }}</h5>
    </div>

    <div class="flex items-center w-full scroll-container justify-between pe-11 md:pe-0 md:mt-8">
      <div v-for="(item, index) in props.items" class="flex items-center justify-between"
        :class="[index+1 != props.items.length? 'w-full ':'min-w-fit']">
        <div class="px-4  md:py-4 py-2 flex items-center min-w-fit gap-2 text-xl font-medium border-2  rounded-full"
          :class="[props.step > index + 1?'bg-secondary border-secondary text-white':props.step < index + 1?'text-[#666666] border-[#EEEEEE]':'  border-secondary']">
          <div class="flex justify-center items-center border-2 rounded-full w-8 h-8"
            :class="[props.step >= index + 1?' border-secondary':'border-[#EEEEEE]']">
            <p v-if="props.step <= index + 1" class="">{{ index + 1 }}</p>

            <NuxtIcon v-else name="correct" class="text-[2.2rem] w-[2.2rem] h-[2.2rem]" />
          </div>

          <p class="md:text-xl">{{ $t("labels." + item) }}</p>
        </div>

        <div v-if="index+1 != props.items.length" class=" min-h-1 w-full min-w-6"
          :class="[props.step > index + 1?'bg-secondary':'bg-[#EEEEEE]']"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  items: {
    type: Array,
    required: true,
    default: [],
  },
  isFromHome: {
    type: Boolean,
    required: false,
  },
  step: {
    type: Number,
    required: true,
    default: 1,
  },
});
const emits = defineEmits(["back"]);

const router = useRouter();

function back() {
  if (props.isFromHome || props.step == 1){
    router.go(-1);
  }else{
    emits("back")
  }
}
</script>

<style scoped lang="scss">
.next {
  // @apply relative before:content-[''] before:absolute before:top-1/2 before:translate-x-full before:end-0 before:h-1 before:bg-secondary before:w-full ;
}
</style>
