<template>
  <div class="w-full">
    <VeeField :name="props.name" v-slot="{ field, meta }">
      <div class="flex flex-col gap-3 relative">
        <div class="flex gap-1 items-center" v-if="props.label">
          <label v-if="props.label" class="font-medium" :class="[props.isRequired ? 'isRequiredSign' : '']"
            :for="props.name">
            {{ props.label }}</label>
        </div>

        <div class="inputBase overflow-hidden relative flex items-center gap-2 text-center" :class="[
          ...(props.classes ?? []),
          meta.touched && !meta.valid
            ? '!border !border-red-500 !text-red-500'
            : '',
          dynamicLabel ? '!py-5' : '',
          props.preIcon ? 'gap-4' : '',
        ]">
          <NuxtIcon v-if="props.preIcon" class="m-0" :class="[...(props.preIconClasses ?? [])]" :name="props.preIcon" />

          <input @click="clickAction" @blur="blurAction" :id="specialID" v-bind="field" :type="currentType"
            :placeholder="props.placeholder" class="w-full !bg-white flex focus:outline-none font-medium" :class="[
              props.isCenter ? 'text-center' : '',
              dynamicLabel ? 'mt-1 ps-3 -mb-1' : '',
            ]" :min="props.min ?? 0" :max="props.max" required=""
            @input="emits('update:value', $event.target.value)" />

          <label :for="specialID"
            class="dynamicLabel font-normal absolute transition-all group text-textLight start-4 top-1/2 -translate-y-1/2"
            v-if="dynamicLabel">{{ dynamicLabel }}
            <span class="text-[#A5A5A5] text-xs !mb-1" v-if="props.isOptional">({{ $t("inputLabels.optional")
            }})</span></label>

          <button type="button" v-if="props.showVisibility" @click="showPassword">
            <NuxtImg class="w-6 h-6" :src="currentType == 'password'
              ? '/icons/eye.svg'
              : '/icons/eye-close.svg'
              " />
          </button>
        </div>

        <vee-error-message v-if="meta.touched && !meta.valid" :name="props.name" as="span" class="errorStyle" />
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
  title: {
    type: String,
    default: "",
  },
  classes: {
    type: Array,
    default: [],
  },
  showVisibility: {
    type: Boolean,
    default: false,
  },
  preIcon: {
    type: String,
    required: false,
  },
  preIconClasses: {
    type: Array,
    required: false,
  },
  min: {
    type: Number,
    required: false,
  },
  max: {
    type: Number,
    required: false,
  },
  isCenter: {
    type: Boolean,
    default: false,
  },
  dynamicLabel: {
    type: String,
    required: false,
  },
  isOptional: {
    type: Boolean,
    required: false,
  },
  isRequired: {
    type: Boolean,
    required: false,
  },
  action: {
    type: String,
    required: false,
  }
});

const emits = defineEmits(["update:value", "update:action"]);


const blurAction = () => {
  if (props.action) {
    emits("update:action", "");
  }
};

const clickAction = () => {
  if (props.action) {
    emits("update:action", props.action);
  }
};




const currentType = ref(props.type);
const specialID = `${props.name}-${Date.now()}`;

function showPassword() {
  if (currentType.value == "text") {
    currentType.value = "password";
  } else {
    currentType.value = "text";
  }
}
</script>

<style scoped lang="scss">
:is(input:focus, input:valid)~label {
  transform: translateX(-5%) translateY(-130%);
  color: #1d1f1f;
  font-size: 12px;
}

input[type="password"] {
  @apply text-[#A5A5A5] -my-14;

  &:focus {
    @apply text-textDark;
  }

  &:valid {
    @apply h-6 text-5xl;
    letter-spacing: -3px !important;
    /* Adjust space between characters */
  }
}
</style>
