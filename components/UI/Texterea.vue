<template>
  <div class="w-full">
    <VeeField :name="props.name" v-slot="{ field, meta }">
      <div class="flex flex-col gap-3 relative">
        <div class="flex gap-1 items-center" v-if="props.label">
          <label v-if="props.label" class="font-medium" :for="props.name">
            {{ props.label }} <span class="text-[#A5A5A5] text-xs !mb-1" v-if="props.isOptional">({{
              $t("inputLabels.optional") }})</span></label>
        </div>

        <div class="inputBase relative flex items-center gap-2 text-center" :class="[
          ...props.classes,
          meta.touched && !meta.valid
            ? '!border !border-red-500 !text-red-500'
            : '',
          props.dynamicLabel ? '!py-5' : '',
        ]">
          <ClientOnly>
            <textarea v-bind="field" :id="props.name" :placeholder="props.placeholder"
              class="w-full focus:outline-none font-medium" :class="[
                props.isCenter ? 'text-center' : '',
                props.dynamicLabel ? 'mt-6 ps-1 -mb-4' : '',
              ]" :rows="props.row" required="">
            </textarea>

            <label :for="props.name"
              class="dynamicLabel font-normal absolute transition-all group text-textLight start-4 top-10 -translate-y-1/2"
              v-if="props.dynamicLabel">{{ props.dynamicLabel }}
              <span class="text-[#A5A5A5] text-xs !mb-1" v-if="props.isOptional">({{ $t("inputLabels.optional")
              }})</span></label>
          </ClientOnly>
        </div>

        <vee-error-message v-if="meta.touched && !meta.valid" :name="props.name" as="span"
          class="errorStyle bg-transparent" />
      </div>
    </VeeField>
  </div>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
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
    type: Array,
    default: [],
  },
  isCenter: {
    type: Boolean,
    default: false,
  },
  row: {
    type: Number,
    default: 1,
  },
  dynamicLabel: {
    type: String,
    required: false,
  },
  isOptional: {
    type: Boolean,
    default: false,
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
:is(textarea:focus, textarea:valid)~label {
  transform: translateX(-5%) translateY(-130%);
  color: #1d1f1f;
  font-size: 12px;
}
</style>
