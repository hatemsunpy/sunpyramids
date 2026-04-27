<template>
  <section class="lg:px-20 px-4 pt-8 pb-5">
    <div class="lg:bg-[#f9fafb]  lg:p-8 w-full rounded-[2rem]">
      <VeeForm :initial-values="{
        title: ''
      }" :validation-schema="schema" v-slot="{ values, errors }" @submit="submit">
        <div class="flex items-center gap-4 w-full">
          <div class=" w-full relative">
            <UIText :placeholder="$t('labels.blog.searchPlaceholder')" :title="$t('labels.manyDays')"
              :classes="['!rounded-full !py-[21px] group']" pre-icon="search" :pre-icon-classes="[
                'text-xl w-5 h-5 text-[#DEDEDE] group-hover:text-[#4d78e5] transition',
              ]" name="title" />

            <button v-if="values.title" type="submit" @click="type = 'clear'"
              class="absolute top-1/2 border rounded-full bg-primary/20 -translate-y-1/2 rotate-45 right-8">
              <NuxtIcon name="add" class="text-primary text-2xl" />
            </button>
          </div>

          <UIButton :classes="[
            '!py-[21px] px-[3.5rem] lg:flex hidden  min-w-fit bg-secondary text-white font-medium hover:bg-[#c57007] h-full',
          ]" :text="$t('labels.search')" type="submit" />
          <UIButton :classes="[
            '!min-w-16 !max-w-16 !min-h-16 !max-h-16 !p-0 min-w-fit lg:!hidden !flex !justify-center !items-center !m-0 !gap-0 bg-secondary text-white font-medium hover:bg-[#c57007] h-full',
          ]" :pre-icon-classes="[
            'text-[1.5rem] w-6 h-6 !text-[#FFFFFF] transition',
          ]" type="submit" pre-icon="search-normal" />
        </div>
      </VeeForm>
    </div>
  </section>
</template>

<script setup lang="js">
import { configure } from "vee-validate";
import * as yup from "yup";

const props = defineProps({
  isBlogs: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["update:title"])
const router = useRouter()

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const schema = yup.object().shape({
  title: yup.string(),
});


const type = ref("submit")

const submit = (values, actions) => {
  if (values.title) {
    if (props.isBlogs) {
      emit("update:title", type.value === 'clear' ? "" : values.title)
    } else {
      router.push({ path: '/blogs/all-blogs', query: { title: type.value === 'clear' ? "" : values.title } })
    }
    if (type.value === 'clear') {
      actions.resetForm()
      type.value = 'submit'
    }
  }
}
</script>

<style scoped lang="scss"></style>
