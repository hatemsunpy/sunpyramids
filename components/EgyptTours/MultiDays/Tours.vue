<template>
  <section class="2xl:px-20 px-4 xl:px-10 xl:py-14 pt-5  bg-[#FFFFFF] flex gap-6">
    <!-- <div v-show="isOpenFilter"
      class="min-w-[20rem] max-h-fit lg:block hidden border sticky top-40 rounded-3xl py-6 px-5">
      <VeeForm :validation-schema="schema" v-slot="{ values, errors }" @submit="submit" :initial-values="initialValues">
        <SharedDropDown @update="MenuFilters.price = $event" :title="$t('inputLabels.price')">
          <UIRange minName="min" maxName="max" />
        </SharedDropDown>

        <div class="col-span-2 h-[2px] my-6 bg-[#F9FAFB]"></div>

        <UIButton :text="$t(`labels.search`)" type="submit" :classes="[
          'border border-secondary !py-3 bg-secondary text-white border-[1px] hover:bg-[#c57007] w-full !justify-center font-meduim hover:text-white',
        ]" />
      </VeeForm>
    </div> -->

    <div class="w-full">
      <div class="xl:hidden flex justify-between items-center mb-4">
        <p class="text-xl font-medium">{{ props.title ? `${props.title} Tours` : "" }}</p>
        <UIOrder @click="order = $event" :items="orderItems" title="name" value="id" :classes="[
          'bg-transparent  !text-base  !rounded-full !py-2  !focus:outline-none  w-[8rem] !border !border-textLight group transition hover:bg-textDark !hover:text-white',
        ]" :placeholderClasses="[
          '!text-textDark !text-base group-hover:!text-white transition font-normal -mt-[1px]',
        ]" :placeholder="$t('labels.sortBy')" name="order" :is-not-full-width="true" />
      </div>

      <div class="flex justify-between items-start">
        <div class="w-full scroll-container flex md:flex-wrap items-center gap-4">
          <!-- <UIButton :text="$t(`labels.filtter`)" :classes="[
            'border border-primary border-[1px] !hidden md:!flex hover:bg-primary font-meduim hover:!text-white !px-4',
          ]" preIcon="filters" :preIconClasses="['text-3xl w-7 h-7 mx-w-fit group-hover:!text-white !transition']"
            @click="isOpenFilter = !isOpenFilter" /> -->

          <button v-for="item in catogries" :key="item.id"
            class="px-6 py-2 bg-[#F7F7F7] text-sm hover:bg-[#eeeeee]  rounded-full min-w-fit  flex gap-2" :class="[
              selecterBtnsFilter.some((btn) => btn.id == item.id)
                ? 'bg-[#e9eefc] text-primary hover:!bg-[#e9eefc]'
                : '',
            ]" @click="filterBtnfn(item)">
            <p>{{ item.title }}</p>

            <img v-if="selecterBtnsFilter.some((btn) => btn.id == item.id)" src="../../../public/icons/close-circle.svg"
              alt="" class="-me-3 w-5" />
          </button>
        </div>

        <UIOrder @click="order = $event" :items="orderItems" title="name" value="id" :classes="[
          'bg-transparent   !rounded-full !py-2 !hidden xl:!flex !focus:outline-none  w-[8rem] !border !border-textLight group transition hover:bg-textDark !hover:text-white',
        ]" :placeholderClasses="[
          '!text-textDark group-hover:!text-white transition font-normal -mt-[1px]',
        ]" :placeholder="$t('labels.sortBy')" name="order" :is-not-full-width="true" />
      </div>

      <div v-if="!isLoading && tours" class="w-full grid gap-x-5 gap-y-8 my-8 mb-[4.5rem] openFilterGrids">
        <SharedTourCard v-for="tour in tours?.data" :key="tour?.id" :item="tour" :showTimer="false" />
      </div>

      <div v-if="!isLoading && !tours?.data.length"
        class="w-full h-[500px] my-8 mb-[4.5rem] flex justify-center items-center">
        <p class="text-2xl">There is not tours found :(</p>
      </div>

      <div v-if="isLoading" class="w-full flex items-center justify-center h-[500px]">
        <UILoadingData />
      </div>

      <UIPagination :page="page" @update="page = $event" :total="tours?.total" :to="tours?.to" :from="tours?.from"
        :pages="tours?.last_page" />
    </div>
  </section>


  <!-- <div class="fixed bottom-0 start-0 md:hidden p-4 bg-[#ffffff] z-40 w-full">
    <UIButton type="submit" @click="isOpenFilterMobile = true" :classes="[
      'py-4 !px-12 w-full !justify-center gap-2 border bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
    ]" :text="$t('labels.filtter')" />
  </div> -->


  <div v-show="isOpenFilterMobile"
    class="w-full fixed top-0 start-0 z-50  h-screen block lg:hidden bg-[#ffffff] border   py-6 px-5">
    <VeeForm :validation-schema="schema" v-slot="{ values, errors }" @submit="submit" :initial-values="initialValues">
      <div class="flex flex-col  relative h-screen justify-between">
        <SharedDropDown @update="MenuFilters.price = $event" :title="$t('inputLabels.price')">
          <UIRange minName="min" maxName="max" />
        </SharedDropDown>

        <div class="col-span-2 h-[2px] my-6 bg-[#F9FAFB]"></div>

        <UIButton :text="$t(`labels.search`)" type="submit" :classes="[
          'border border-secondary !absolute !bottom-10 !start-0 !py-3 bg-secondary text-white border-[1px] hover:bg-[#c57007] w-full !justify-center font-meduim hover:text-white',
        ]" />
      </div>
    </VeeForm>
  </div>
</template>

<script setup lang="js">
import { configure } from "vee-validate";
import * as yup from "yup";

const { getData } = useApi()
const isOpenFilter = ref(false)
const route = useRoute()
const isOpenFilterMobile = ref(false)
const { t } = useI18n()
const totalGlobalTrips = ref(0)

const props = defineProps({
  title: {
    type: String
  }
})
configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});

const isLoading = ref(true)

const MenuFilters = ref({
  price: true,
})
const catogries = ref([{ id: "All", title: "All" }, { id: 2, title: "2 Days" }, { id: 3, title: "3 Days" }, { id: 4, title: "4 Days" }, { id: 5, title: "5 Days" }, { id: 6, title: "6 Days" }, { id: 7, title: "7 Days" }, { id: 8, title: "8 Days" }, { id: 9, title: "9 Days" }, { id: 10, title: "10 Days" }, { id: 11, title: "11 Days" }, { id: 12, title: "12 Days" }, { id: 13, title: "13 Days" }, { id: 14, title: "14 Days" }, { id: 15, title: "15 Days" }])

const selecterBtnsFilter = ref([{ id: "All", title: "All" }])
const tours = ref(null)
const orderItems = [{ id: 'name-asc', name: 'A to Z', value: 'asc' }, { id: 'name-desc', name: 'Z to A', value: 'desc' }, { id: 'price-asc', name: 'Lowest Price', value: 'asc' }, { id: 'price-desc', name: 'Highest Price', value: 'desc' }]

const filterBtnfn = (item) => {
  if (selecterBtnsFilter.value.some((btn) => btn == item)) {
    // if (item.id == "All") {
    //   selecterBtnsFilter.value = []
    // } else {
    //   if (selecterBtnsFilter.value.some((btn) => btn.id == "All")) selecterBtnsFilter.value = selecterBtnsFilter.value.filter((btn) => btn.id != "All")

    // }
    selecterBtnsFilter.value = selecterBtnsFilter.value.filter((btn) => btn != item)
  } else {
    if (item.id == "All") {
      selecterBtnsFilter.value = [{ id: "All", title: "All" }]
    } else {
      if (selecterBtnsFilter.value.some((btn) => btn.id == "All")) selecterBtnsFilter.value = selecterBtnsFilter.value.filter((btn) => btn.id != "All")
      selecterBtnsFilter.value = [...selecterBtnsFilter.value, item]
    }
  }
}

const schema = yup.object().shape({
  min: yup.number().required(),
  max: yup.number().required(),
});

const initialValues = ref({
  min: 0,
  max: 11000,
})

const thisCategory = ref(null)

const getCatogries = async () => {
  await getData("categories?parent_id=3&page_limit=100").then((res) => {
    thisCategory.value = res.data.data.find((item) => item.slug == route.params.slug)

    getTours()
  })
}
getCatogries()

const order = ref("")

const page = ref(1)
const getTours = async (values) => {
  let url = "tours"

  isLoading.value = true
  tours.value = null
  isOpenFilterMobile.value = false
  window.scrollTo({ top: 200, behavior: "smooth" });
  let params = [`exists=wishlisted`, `&categories.id=${thisCategory.value.id}`]

  if (!selecterBtnsFilter.value.includes({ id: "All", title: "All" })) {
    selecterBtnsFilter.value.forEach(element => {
      if (element.id != "All") params = [...params, `&duration_in_days%5B%5D=${element.id}`]
    });
  }

  // if (MenuFilters.value.price) {
  //   params = values && values.min ? [...params, `&adult_price=gteq::${values.min}`] : [...params, `&adult_price=gteq::${initialValues.value.min}`]
  //   params = values && values.max ? [...params, `&adult_price=lteq::${values.max}`] : [...params, `&adult_price=lteq::${initialValues.value.max}`]
  // }
  if (!order.value) {
    params = [...params, `&order_by=display_order,asc`]
    params = [...params, `&page=${page.value}`, `&page_limit=24`,]

  } else {
    if (order.value.includes("name")) {
      params = [...params, `&order_by=slug,${order.value.split("-")[1]}`]
      params = [...params, `&page=${page.value}`, `&page_limit=24`,]
    } else if (order.value.includes("price")) {
      url = `tours/${order.value.split("-")[1]}/${page.value}`
      params = [...params, `&page=${page.value}`, `&page_limit=${totalGlobalTrips}`,]
    }
  }
  const query = params.join("")
  await getData(`${url}?${query}`).then((res) => {
    tours.value = res.data
    if (totalGlobalTrips.value == 0)
      totalGlobalTrips.value = res.total
    isLoading.value = false
  })
}

watch([selecterBtnsFilter, order], () => {
  page.value = 1
  getTours()
})

watch(page, () => {
  getTours()
})

const submit = (values) => {
  getTours(values)
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 1s ease;
  min-width: 17.5rem;
  transform: scale(100%);
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  min-width: 0rem;
  transform: scale(0%);
  opacity: 0.5;
}
</style>
