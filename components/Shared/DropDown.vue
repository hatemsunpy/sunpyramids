<template>
  <div class="w-full">
    <div class="flex justify-between items-center hover:bg-[#eeeeee] rounded-lg cursor-pointer transition-colors"
      @click.self="isClose = !isClose" :class="isOption ? 'p-2' : 'p-2'">
      <div class="maincntr flex gap-2 items-center group w-fit">
        <input v-if="props.isOption" v-model="filterWith" @change="emits('update', filterWith)" type="checkbox" :id="id"
          class="hidden-xs-up maincbxInput" />
        <label v-if="props.isOption" :for="id"
          class="maincbx group-hover:border-[#0d2359] checked: transition-colors"></label>

        <label @click="isClose = !isClose" :for="id"
          class="font-medium cursor-pointer group-hover:text-[#0d2359] transition-colors"
          :class="[filterWith ? 'text-primary' : '']">{{ props.title }}</label>
      </div>

      <NuxtIcon name="arrow-down" class="cursor-pointer text-xl transition-all"
        :class="!isClose ? 'rotate-180' : 'rotate-0'" @click="isClose = !isClose" />
    </div>

    <div v-show="isClose" class="h-fit">
      <slot />
    </div>
    <!-- <Transition name="fade"> -->
    <!-- </Transition> -->
  </div>
</template>

<script setup lang="js">
const isClose = ref(true)
const props = defineProps({
  title: {
    type: String,
    required: false
  },
  value: {
    type: Boolean || []
  },
  isOption: {
    type: Boolean,
    default: true
  }
})
const filterWith = ref(props.value ?? true)

const emits = defineEmits(["update"]);

const id = `maincbx-${Math.random() * 40000}`
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 1s ease;
  transform: scale(100%);
  opacity: 1;
  height: fit-content;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0%);
  opacity: 0.5;
  height: 0px;
}
</style>
