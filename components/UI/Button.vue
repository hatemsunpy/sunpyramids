<template>
  <button @click="emits('click')" :disabled="props.disabled || props.loading" :type="props.type"
    class="py-2 px-6 group rounded-full flex items-center justify-between gap-1 text-primary relative" :class="[
      ...(props.classes ?? []),
      props.disabled ? 'disabled:opacity-50' : '',
    ]">
    <NuxtIcon v-if="props.preIcon" class=" text-primary" :class="[
      ...(props.preIconClasses ?? []),
      props.disabled ? 'group-hover:!opacity-0 transition-all duration-0' : 'duration-0 transition-all opacity-100',
      props.loading ? '!opacity-0' : '!opacity-100',
    ]" :name="props.preIcon" />

    <span :class="[
      props.loading ? '!opacity-0' : '',
      props.disabled
        ? 'group-hover:opacity-0 transition-all'
        : 'transition-all opacity-100',
    ]">{{ props.text }}</span>

    <NuxtIcon class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl" v-if="props.disabled" :class="[
      props.disabled
        ? 'opacity-0 group-hover:opacity-100 transition-all'
        : 'opacity-0 transition-all',
    ]" name="slash" />

    <NuxtIcon v-if="props.postIcon" :class="[
      ...(props.postIconClasses ?? []),
      props.loading ? 'opacity-0' : '',
    ]" :name="props.postIcon" />

    <div v-if="props.loading" class="absolute top-0 start-0 w-full h-full flex justify-center items-center">
      <div class="spinner"></div>
    </div>
  </button>
</template>

<script setup lang="js">
const emits = defineEmits(["click"])
const props = defineProps({
  text: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    default: 'button',
  },
  classes: {
    type: Array,
    required: false,
  },
  preIcon: {
    type: String,
    required: false,
  },
  postIcon: {
    type: String,
    required: false,
  },
  postIconClasses: {
    type: Array,
    required: false,
  },
  preIconClasses: {
    type: Array,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  loading: {
    type: Boolean,
    required: false,
  },
})
</script>

<style scoped lang="scss">
button {
  .loading {
    @apply w-8 h-8 border-2 border-primary border-l-white rounded-full animate-spin;
  }
}

.spinner {
  width: 8px;
  height: 8px;
  border-radius: 8px;
  box-shadow: 20px 0px 0 0 rgba(255, 255, 255, 0.2), 16.2px 11.8px 0 0 rgba(255, 255, 255, 0.4), 6.2px 19px 0 0 rgba(255, 255, 255, 0.6), -6.2px 19px 0 0 rgba(255, 255, 255, 0.8), -16.2px 11.8px 0 0 #ffffff;
  animation: spinner-b87k6z 1s infinite linear;
}

@keyframes spinner-b87k6z {
  to {
    transform: rotate(360deg);
  }
}
</style>
