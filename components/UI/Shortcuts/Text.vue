<template>
  <VeeField :name="props.name" v-slot="{ field, meta }">
    <div
      class="flex items-center gap-4 relative px-8 py-2 w-full border-dark border rounded-[3.5rem]"
    >
      <div class="flex flex-col gap-2 w-full">
        <label class="radio-button text-sm xl:text-base flex justify-between">
          {{ props.title }}
        </label>

        <input
          :id="props.name"
          v-bind="field"
          :type="currentType"
          :placeholder="props.placeholder"
          class="w-full focus:outline-none p-0 font-medium ms-[1px] placeholder:text-textLight"
        />

        <button v-if="props.showVisibility" type="button" @click="showPassword">
          <i
            :class="
              currentType == 'password'
                ? 'fa-solid fa-eye-slash'
                : currentType == 'password'
                ? 'fa-solid fa-eye'
                : ''
            "
          ></i>
        </button>
      </div>
      <vee-error-message
        v-if="meta.touched && !meta.valid"
        :name="props.name"
        as="span"
        class="errorStyle"
      />
    </div>
  </VeeField>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  classes: {
    type: String,
    default: "",
  },
  showVisibility: {
    type: Boolean,
    default: false,
  },
  preIcon: {
    type: String,
    required: false,
  },
  preIconClass: {
    type: String,
    required: false,
  },
});

const currentType = ref(props.type);

function showPassword() {
  if (currentType.value == "text") {
    currentType.value = "password";
  } else {
    currentType.value = "text";
  }
}
</script>

<style scoped lang="scss">
.input {
  @apply px-8 py-0 border-dark border rounded-[3.5rem];
}
</style>
