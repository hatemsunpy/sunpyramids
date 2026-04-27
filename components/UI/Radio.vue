<template>
  <VeeField :name="props.name" v-slot="{ field, meta }" as="div">
    <label class="radio-button text-sm xl:text-base flex justify-between">
      <input
        :checked="field.value == props.value"
        v-bind="field"
        :name="props.name"
        :value="props.value"
        type="radio"
      />
      <span class="radio-checkmark"></span>

      <span
        class="font-medium ms-1 transition-colors duration-75"
        :class="[field.value == props.value ? 'text-secondary' : '']"
        >{{ props.title }}</span
      >
    </label>

    <vee-error-message
      v-if="meta.touched && !meta.valid"
      :name="props.name"
      as="div"
      class="text-red-500 w-full"
    />
  </VeeField>
</template>

<script setup lang="js">
const props = defineProps({
  title:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true,
    default:'',
  },
  value:{
    type:String,
    required:true,
    default:'',
  }
})
</script>

<style scoped lang="scss">
.radio-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.075s ease-in-out;
}

.radio-button input[type="radio"] {
  display: none;
}

.radio-checkmark {
  display: inline-block;
  position: relative;
  min-width: 24px;
  min-height: 24px;
  border: 2px solid;
  border-radius: 50%;
  @apply border-secondary;
}

.radio-checkmark:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  min-width: 16px;
  min-height: 16px;
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
  @apply bg-secondary;
}

.radio-button input[type="radio"]:checked ~ .radio-checkmark:before {
  transform: translate(-50%, -50%) scale(1);
}
</style>
