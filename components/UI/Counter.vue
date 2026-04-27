<template>
  <section class="relative">
    <p v-if="props.title" class="font-medium mb-3">{{ props.title }}</p>

    <div class="border-[#EEEEEE] border w-full  flex" :class="[props.rounded ? ' rounded-full' : 'rounded-2xl']">
      <UIButton
        :classes="[
          'min-w-fit border border-s -ms-[1px] border-[1px] text-base font-medium hover:bg-textDark text-textDark border-third bg-white font-meduim hover:text-white',
          , meta.touched && !meta.valid ? '!border-red-500 !text-red-500' : '', props.rounded ? ' !rounded-full !min-w-[3.25rem] !justify-center  !min-h-[3.25rem] !py-0   !px-0' : '!rounded-2xl !py-[14px]   !px-10 ']"
        postIcon="minus" :postIconClasses="['text-2xl mb-0 w-6 h-6']" type="button" @click="changeValue('minus')" />

      <input v-model="fieldValue" readonly type="text"
        class="w-full font-medium text-center focus:outline-none cursor-default" />

      <UIButton
        :classes="[
          'min-w-fit border -me-[1px]  border-[1px] text-base font-medium hover:bg-textDark text-textDark border-third bg-white font-meduim hover:text-white',
          , meta.touched && !meta.valid ? '!border-red-500 !text-red-500' : '', props.rounded ? ' !rounded-full !min-w-[3.25rem] !justify-center  !min-h-[3.25rem] !py-0   !px-0' : '!rounded-2xl !py-[14px]   !px-10 ']"
        postIcon="add" :postIconClasses="['text-2xl mb-0 w-6 h-6']" type="button" @click="changeValue('add')" />
    </div>

    <div v-if="meta.touched && !meta.valid || !meta.valid" class="errorStyle">
      {{ $t("errors.minMemer", { name: $t(props.title) }) }}
    </div>
  </section>
</template>

<script setup lang="js">
import { useField } from 'vee-validate'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  rounded: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(["update:value"])

const { value: fieldValue, meta } = useField(props.name)


const changeValue = (type) => {
  meta.touched = true
  if (type == 'add') {
    fieldValue.value = +fieldValue.value + 1
  } else {
    if (fieldValue.value != 0) {
      fieldValue.value = +fieldValue.value - 1
    }
  }

  emits("update:value", fieldValue.value)
}
</script>

<style scoped lang="scss"></style>
