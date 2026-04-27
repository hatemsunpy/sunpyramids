<template>
  <VeeForm :validation-schema="schema" v-slot="{ values, errors }" @submit="submit">
    <div class="p-6 bg-white w-full relative z-30 rounded-[2.5rem]">
      <div class="flex lg:flex-row flex-col lg:items-center  xl:gap-4 lg:gap-1 gap-4 w-full">
        <ClientOnly>
          <UIShortcutsSelect :items="data" title="title" value="slug" name="place"
            :placeholder="$t('labels.placeholderWhere')" :label="$t('labels.where') + '?'" />

          <UIShortcutsSelect :items="daysArray" title="title" value="value" name="duration"
            :placeholder="$t('labels.placeholderHowLong')" :label="$t('labels.howLong') + '?'" />

          <div>
            <UIButton :classes="[
              'py-6 px-[3.5rem]  w-full lg:hidden flex bg-secondary !justify-center text-white font-medium hover:bg-[#c57007] h-full',
            ]" :text="$t('labels.search')" type="submit" />
            <UIButton :classes="[
              'py-6 px-[3.5rem] min-w-fit lg:flex hidden  !justify-center bg-secondary text-white font-medium hover:bg-[#c57007] h-full',
            ]" :text="$t('labels.search')" type="submit" />
          </div>
        </ClientOnly>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="js">
import { configure } from "vee-validate";
import * as yup from "yup";

const { t } = useI18n();


const daysArray = Array.from({ length: 45 }, (_, i) => ({
  title: `${i + 1} ${i + 1 === 1 ? "Day" : "Days"}`,
  value: i + 1
}));

const { getData } = useApi()
const router = useRouter()
const localePath = useLocalePath()
const data = ref([])
const getHiglights = async () => {
  await getData("destinations?page_limit=200&parent.slug=egypt&order_by=display_order,asc").then((res) => {
    data.value = res.data.data
  })
}
getHiglights()
configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const schema = yup.object().shape({
  place: yup.string().required(t("errors.isRequired", { name: t("inputLabels.place") })),
  duration: yup.number().required(t("errors.isRequired", { name: t("labels.howLong") })),
});

const submit = (values) => {
  router.push(localePath(`/trips?days=${values.duration}&distination=${values.place}`))
};
</script>

<style scoped lang="scss"></style>
