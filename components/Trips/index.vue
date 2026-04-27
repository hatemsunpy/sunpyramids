<template>
  <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

  <h3 class=" xl:block hidden pt-10 pb-12 text-5xl px-20 bg-white font-bold">
    {{ $t("labels.trips.egyptTours") }}
  </h3>
  <section class="2xl:px-20 px-4 xl:px-10 xl:pb-14   bg-[#FFFFFF] flex gap-6">
    <div class="min-w-[20rem] max-w-[20rem] lg:block hidden   max-h-fit border sticky top-40 rounded-3xl py-6 ">
      <VeeForm @submit="submit" :validation-schema="schema" v-slot="{ values, errors }" :initial-values="initialValues">

        <div class="max-h-[32rem] min-h-[32rem] px-4 mx-1 pb-5 overflow-y-auto">
          <SharedDropDown :isOption="false" title="Tours Type">
            <div class="ms-6 mt-1">
              <div v-for="item in mainCategories"
                class="flex items-center justify-between hover:bg-[#eeeeee] p-1 rounded-lg transition-colors">
                <div class="maincntr flex gap-2 items-center group w-fit">
                  <input @change="updateSelected(item)" v-model="selectedMainCatogry" type="checkbox" :value="item.id"
                    :id="item.id" class="hidden-xs-up maincbxInput" />
                  <label :for="item.id" class="maincbx group-hover:border-[#0d2359] checked: transition-colors"></label>

                  <label :for="item.id" class="font-medium cursor-pointer group-hover:text-[#0d2359] transition-colors"
                    :class="[selectedMainCatogry.includes(item.id) ? 'text-primary' : '']">{{ item.title }}</label>
                </div>

                <p class="text-xs text-[#666666]">{{ categoriesCount ? categoriesCount[item.slug] : '' }}</p>
              </div>
            </div>
          </SharedDropDown>

          <div class="col-span-2 h-[2px] my-6 bg-[#F9FAFB]"></div>

          <SharedDropDown @update="MenuFilters.price = $event" :value="MenuFilters.price"
            :title="$t('inputLabels.price')">
            <div class="px-2">
              <UIRange minName="min" maxName="max" />
            </div>
          </SharedDropDown>

          <div class="col-span-2 h-[2px] my-6 bg-[#F9FAFB]"></div>

          <SharedDropDown v-show="selectedMainCatogry.includes(3)" @update="MenuFilters.days = $event"
            :value="MenuFilters.days" :title="$t('labels.days')">
            <div class="mt-5 px-2">
              <UICounter :rounded="true" name="days" />
            </div>
          </SharedDropDown>

          <div class="col-span-2 h-[2px] my-6 bg-[#F9FAFB]"></div>

          <SharedDropDown :isOption="false" title="Egypt Destinations">
            <div class="ms-6 mt-1">
              <div v-for="item in shownDistination()"
                class="flex items-center justify-between hover:bg-[#eeeeee] p-1 rounded-lg transition-colors">
                <div class="maincntr flex gap-2 items-center group w-fit">
                  <input v-model="selectedDistinations" @change="updatedistination(item)" type="checkbox"
                    :value="item.id" :id="`dist-${item.id}`" class="hidden-xs-up maincbxInput" />
                  <label :for="`dist-${item.id}`"
                    class="maincbx group-hover:border-[#0d2359] checked: transition-colors"></label>

                  <label :for="`dist-${item.id}`"
                    class="font-medium cursor-pointer group-hover:text-[#0d2359] transition-colors"
                    :class="[selectedDistinations.includes(item.id) ? 'text-primary' : '']">{{ item.title }}</label>
                </div>
              </div>

              <div v-if="distinations.length > 5"
                class=" text-sm mt-2 ps-1 cursor-pointer hover:!text-primary flex items-center gap-2"
                @click="isShowAllDistination = !isShowAllDistination">
                <p>Show more</p>

                <NuxtIcon name="arrow-down" class="transition-all"
                  :class="[!isShowAllDistination ? 'rotate-0' : '-rotate-180']" />
              </div>
            </div>
          </SharedDropDown>

          <div class="col-span-2 h-[2px] my-6 bg-[#F9FAFB]"></div>

          <SharedDropDown :isOption="false" :title="$t('labels.category')">
            <div class="ms-6 mt-1">
              <div v-for="item in shownCategories()"
                class="flex items-center justify-between hover:bg-[#eeeeee] p-1 rounded-lg transition-colors">
                <div class="maincntr flex gap-2 items-center group w-fit">
                  <input v-model="selectedCatogries" @change=" filterBtnfn(item)" type="checkbox" :value="item.id"
                    :id="`cate-${item.id}`" class="hidden-xs-up maincbxInput" />
                  <label :for="`cate-${item.id}`"
                    class="maincbx group-hover:border-[#0d2359] checked: transition-colors"></label>

                  <label :for="`cate-${item.id}`"
                    class="font-medium cursor-pointer group-hover:text-[#0d2359] transition-colors"
                    :class="[selectedCatogries.includes(item.id) ? 'text-primary' : '']">{{ item.title }}</label>
                </div>
              </div>

              <div v-if="Categories.length > 5"
                class=" text-sm mt-2 ps-1 cursor-pointer hover:!text-primary flex items-center gap-2"
                @click="isShowAllCategories = !isShowAllCategories">
                <p>Show more</p>

                <NuxtIcon name="arrow-down" class="transition-all"
                  :class="[!isShowAllCategories ? 'rotate-0' : '-rotate-180']" />
              </div>
            </div>
          </SharedDropDown>
        </div>

        <div class="px-5">
          <UIButton :text="$t(`labels.search`)" type="submit" :classes="[
            'border border-secondary !py-3 bg-secondary text-white border-[1px] hover:bg-[#c57007] w-full !justify-center font-meduim hover:text-white',
          ]" />
        </div>
      </VeeForm>
    </div>

    <div class="w-full">
      <div class="xl:hidden flex justify-between items-center mb-4">
        <p class="text-xl font-medium">{{ props.title ? `${props.title} Tours` : "" }}</p>
        <UIOrder @click="order = $event" :items="[{ id: 'asc', name: 'A to Z' }, { id: 'desc', name: 'Z to A' }]"
          title="name" value="id" :classes="[
            'bg-transparent  !text-base  !rounded-full !py-2  !focus:outline-none  w-[8rem] !border !border-textLight group transition hover:bg-textDark !hover:text-white',
          ]" :placeholderClasses="[
            '!text-textDark !text-base group-hover:!text-white transition font-normal -mt-[1px]',
          ]" :placeholder="$t('labels.sortBy')" name="order" :is-not-full-width="true" />
      </div>

      <div class="flex justify-between  items-start">
        <div class="w-full flex items-center scroll-container md:flex-wrap gap-4">
          <UIButton v-if="selecterBtnsFilter.length" :text="$t(`labels.trips.clearAll`)" :classes="[
            'border border-primary border-[1px]   hover:bg-primary font-meduim hover:text-white !px-4',
          ]" preIcon="close-circle" :preIconClasses="[
            'text-xl  tranistion duration-300 !opacity-100 group-hover:!text-white w-5 h-5',
          ]" @click="clearAll" />

          <button v-for="item in selecterBtnsFilter"
            class="px-6 py-2 bg-[#F7F7F7] text-sm 'bg-[#e9eefc] min-w-fit text-primary hover:!bg-[#e9eefc]  rounded-full flex gap-2"
            @click="filterBtnfn(item)">
            <p>{{ item.title }}</p>

            <img src="/icons/close-circle.svg" alt="" class="-me-3 w-5" />
          </button>
        </div>

        <UIOrder @click="order = $event" :items="[{ id: 'asc', name: 'A to Z' }, { id: 'desc', name: 'Z to A' }]"
          title="name" value="id" :classes="[
            'bg-transparent !rounded-full !py-2  !hidden xl:!flex !focus:outline-none  w-[8rem] !border !border-textLight group transition hover:bg-textDark !hover:text-white',
          ]" :placeholderClasses="[
            '!text-textDark group-hover:!text-white transition font-normal -mt-[1px]',
          ]" :placeholder="$t('labels.sortBy')" name="order" :is-not-full-width="true" />
      </div>


      <div v-if="!isLoading && tours && tours.data.length > 0"
        class="w-full grid gap-x-5 tourCardBoxRes gap-y-8 my-8 mb-[4.5rem]">
        <SharedTourCard v-for="tour in tours?.data" :key="tour?.id" :item="tour" :showTimer="false" />
      </div>

      <div v-if="!isLoading && !tours.data.length"
        class="w-full h-[500px] my-8 mb-[4.5rem] flex justify-center items-center">
        <p class="text-2xl">There is not tours found :(</p>
      </div>

      <div v-if="isLoading" class="w-full flex items-center justify-center h-[700px]">
        <UILoadingData />
      </div>

      <div class="">
        <UIPagination :page="page" @update="page = $event" :total="tours?.total" :to="tours?.to" :from="tours?.from"
          :pages="tours?.last_page" />
      </div>
    </div>
  </section>


  <div class="fixed bottom-0 start-0 md:hidden p-4 bg-[#ffffff] z-40 w-full">
    <UIButton type="submit" @click="isOpenFilterMobile = true" :classes="[
      'py-4 !px-12 w-full !justify-center gap-2 border bg-primary border-primary border-[1px] text-base font-medium hover:bg-[#143485] text-white font-meduim hover:text-white',
    ]" :text="$t('labels.filtter')" />
  </div>

  <div v-show="isOpenFilterMobile"
    class="w-full px-4 fixed top-0 start-0 z-50 overflow-y-auto pt-16   h-screen block lg:hidden bg-[#ffffff] border py-6">
    <button @click="isOpenFilterMobile = false" class="!ms-auto !right-3 top-5 absolute rotate-45">
      <NuxtIcon name="add" class="text-4xl" />
    </button>

    <VeeForm @submit="submit" :validation-schema="schema" v-slot="{ values, errors }" :initial-values="initialValues">

      <div class="mx-1 w-full pb-5">
        <SharedDropDown :isOption="false" title="Tours Type">
          <div class="ms-6 mt-1">
            <div v-for="item in mainCategories"
              class="flex items-center justify-between hover:bg-[#eeeeee] p-1 rounded-lg transition-colors">
              <div class="maincntr flex gap-2 items-center group w-fit">
                <input @change="updateSelected(item)" v-model="selectedMainCatogry" type="checkbox" :value="item.id"
                  :id="item.id" class="hidden-xs-up maincbxInput" />
                <label :for="item.id" class="maincbx group-hover:border-[#0d2359] checked: transition-colors"></label>

                <label :for="item.id" class="font-medium cursor-pointer group-hover:text-[#0d2359] transition-colors"
                  :class="[selectedMainCatogry.includes(item.id) ? 'text-primary' : '']">{{ item.title }}</label>
              </div>

              <p class="text-xs text-[#666666]">{{ categoriesCount ? categoriesCount[item.slug] : '' }}</p>
            </div>
          </div>
        </SharedDropDown>

        <div class="col-span-2 h-[2px] my-6 bg-[#F9FAFB]"></div>

        <SharedDropDown @update="MenuFilters.price = $event" :title="$t('inputLabels.price')">
          <UIRange minName="min" maxName="max" />
        </SharedDropDown>

        <div class="col-span-2 h-[2px] my-6 bg-[#F9FAFB]"></div>

        <SharedDropDown v-show="selectedMainCatogry.includes(3)" @update="MenuFilters.days = $event"
          :title="$t('labels.days')">
          <div class="mt-5">
            <UICounter :rounded="true" name="days" />
          </div>
        </SharedDropDown>

        <div class="col-span-2 h-[2px] my-6 bg-[#F9FAFB]"></div>

        <SharedDropDown :isOption="false" title="Egypt Destinations">
          <div class="ms-6 mt-1">
            <div v-for="item in shownDistination()"
              class="flex items-center justify-between hover:bg-[#eeeeee] p-1 rounded-lg transition-colors">
              <div class="maincntr flex gap-2 items-center group w-fit">
                <input v-model="selectedDistinations" @change="updatedistination(item)" type="checkbox" :value="item.id"
                  :id="`dist-${item.id}`" class="hidden-xs-up maincbxInput" />
                <label :for="`dist-${item.id}`"
                  class="maincbx group-hover:border-[#0d2359] checked: transition-colors"></label>

                <label :for="`dist-${item.id}`"
                  class="font-medium cursor-pointer group-hover:text-[#0d2359] transition-colors"
                  :class="[selectedDistinations.includes(item.id) ? 'text-primary' : '']">{{ item.title }}</label>
              </div>
            </div>

            <div v-if="distinations.length > 5"
              class=" text-sm mt-2 ps-3 cursor-pointer hover:!text-primary flex items-center gap-2"
              @click="isShowAllDistination = !isShowAllDistination">
              <p>Show more</p>

              <NuxtIcon name="arrow-down" class="transition-all"
                :class="[!isShowAllDistination ? 'rotate-0' : '-rotate-180']" />
            </div>
          </div>
        </SharedDropDown>

        <div class="col-span-2 h-[2px] my-6 bg-[#F9FAFB]"></div>

        <SharedDropDown :isOption="false" :title="$t('labels.category')">
          <div class="ms-6 mt-1">
            <div v-for="item in shownCategories()"
              class="flex items-center justify-between hover:bg-[#eeeeee] p-1 rounded-lg transition-colors">
              <div class="maincntr flex gap-2 items-center group w-fit">
                <input v-model="selectedCatogries" @change=" filterBtnfn(item)" type="checkbox" :value="item.id"
                  :id="`cate-${item.id}`" class="hidden-xs-up maincbxInput" />
                <label :for="`cate-${item.id}`"
                  class="maincbx group-hover:border-[#0d2359] checked: transition-colors"></label>

                <label :for="`cate-${item.id}`"
                  class="font-medium cursor-pointer group-hover:text-[#0d2359] transition-colors"
                  :class="[selectedCatogries.includes(item.id) ? 'text-primary' : '']">{{ item.title }}</label>
              </div>
            </div>

            <div v-if="Categories.length > 5"
              class=" text-sm mt-2 ps-3 cursor-pointer hover:!text-primary flex items-center gap-2"
              @click="isShowAllCategories = !isShowAllCategories">
              <p>Show more</p>

              <NuxtIcon name="arrow-down" class="transition-all"
                :class="[!isShowAllCategories ? 'rotate-0' : '-rotate-180']" />
            </div>
          </div>
        </SharedDropDown>
      </div>

      <div class="">
        <UIButton :text="$t(`labels.search`)" type="submit" :classes="[
          'border border-secondary  !py-3 bg-secondary text-white border-[1px] hover:bg-[#c57007] w-full !justify-center font-meduim hover:text-white',
        ]" />
      </div>
    </VeeForm>
  </div>
</template>

<script setup lang="js">
import { configure } from "vee-validate";
import * as yup from "yup";

const isOpenFilter = ref(false)
const breadcrumbItems = [{ title: "home", disabled: false, path: "/" }, { title: "trips.tours", disabled: true, path: "/rent-car" },]
const { getData } = useApi()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const isLoading = ref(true)
const isOpenFilterMobile = ref(false)

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

const schema = yup.object().shape({
  min: yup.number().required(),
  max: yup.number().required(),
  days: yup.number().required(),
});

const initialValues = ref({
  min: 0,
  max: 11000,
  days: route.query.days ? route.query.days == 1 ? 2 : route.query.days : 2,

})

const MenuFilters = ref({
  price: false,
  days: false,
})

const selecterBtnsFilter = ref([])
const tours = ref(null)

const filterBtnfn = (item) => {
  if (selecterBtnsFilter.value.some((btn) => btn == item)) {
    if (item.slug) {
      selecterBtnsFilter.value = selecterBtnsFilter.value.filter((btn) => btn != item || btn.parent_id == item.id)
    } else {
      selecterBtnsFilter.value = selecterBtnsFilter.value.filter((btn) => btn != item)

      if (item.type && item.type === 'title') {
        const { title, ...rest } = route.query
        router.push(localePath({ query: rest }))
      }
    }

  } else {
    if (selecterBtnsFilter.value.some((btn) => btn.slug) && item.slug) {
      selecterBtnsFilter.value = selecterBtnsFilter.value.filter((btn) => !btn.slug)
    }
    selecterBtnsFilter.value = [...selecterBtnsFilter.value, item]
  }
  if (item.slug) selecterBtnsFilter.value = selecterBtnsFilter.value.filter((btn) => !btn.cate)
  selectedCatogries.value = []
  selectedDistinations.value = []
  selectedMainCatogry.value = []
  selecterBtnsFilter.value.forEach((btn) => {
    if (btn.slug) {
      selectedMainCatogry.value = [btn.id]
    } else if (btn.cate) {
      selectedCatogries.value = [...selectedCatogries.value, btn.id]
    } else if (btn.distination) {
      selectedDistinations.value = [...selectedDistinations.value, btn.id]
    }
  })
}

const selectedCatogries = ref()

const mainCategories = ref([{ id: 1, title: "Day Tour", slug: "day-tour" }, { id: 3, title: "Multi Days Tours", slug: "multi-days-tours" }, { id: 17, title: "Nile Cruises", slug: "nile-cruises" }, { id: 23, title: "Shore Excursions", slug: "shore-excursions" }, { id: 53, title: "Special Offers", slug: "special-offers" },])
const selectedMainCatogry = ref([])
if (route.query.main == "special-offers") {
  selectedMainCatogry.value = [53]
  selecterBtnsFilter.value = [{ id: 53, title: "Special Offers", slug: "special-offers" }]
  selectedCatogries.value = [{ id: 53, title: "Special Offers", slug: "special-offers" }]
}
if (route.query.days) {
  if (route.query.days == 1) {
    selectedMainCatogry.value = [1]
    selecterBtnsFilter.value = [{ id: 1, title: "Day Tour", slug: "day-tour" }]
    selectedCatogries.value = [{ id: 1, title: "Day Tour", slug: "day-tour" }]
    MenuFilters.value.days = false
  } else {
    selectedMainCatogry.value = [3]
    selecterBtnsFilter.value = [{ id: 3, title: "Multi Days Tours", slug: "multi-days-tours" }]
    selectedCatogries.value = [{ id: 3, title: "Multi Days Tours", slug: "multi-days-tours" }]
    MenuFilters.value.days = true
  }
}
if (route.query.title) {
  selecterBtnsFilter.value = [{ id: `thisTitle`, title: route.query.title, type: "title" }]
}
watch(() => route.query.title, (newVal) => {
  if (newVal) {
    if (selecterBtnsFilter.value.some((cate) => cate.id == 'thisTitle')) {
      selecterBtnsFilter.value.find((cate) => cate.id == 'thisTitle').title = newVal
      if (route.query.days) {
        getTours({ days: route.query.days })
      } else {
        getTours()
      }
    } else {
      selecterBtnsFilter.value = [...selecterBtnsFilter.value, { id: `thisTitle`, title: newVal, type: "title" }]
    }
  }
})
const Categories = ref([])
const isShowAllCategories = ref(false)

const shownCategories = () => {
  if (Categories.value.length <= 5 || isShowAllCategories.value) {
    return Categories.value;
  } else {
    return Categories.value.slice(0, 5);
  }
};

const updateSelected = (item) => {
  filterBtnfn(item)
  selectedMainCatogry.value = selectedMainCatogry.value.filter((cate) => cate == item.id)
  getCatogries()
}

const updatedistination = (item) => {
  filterBtnfn(item)
}

const getCatogries = async () => {
  Categories.value = []
  isShowAllCategories.value = false
  selectedCatogries.value = []
  let params = ["page_limit=200"]
  if (selectedMainCatogry.value.length) params = [...params, `&parent_id=${selectedMainCatogry.value[0]}`]
  const query = params.join("")
  await getData(`categories?${query}`).then((res) => {
    res.data.data.forEach(cate => {
      if (cate.parent_id) {
        Categories.value = [...Categories.value, {
          id: cate.id,
          title: cate.title,
          parent_id: cate.parent_id,
          cate: true
        }]
      }
    });
    if (route.query.distination && !distinations.value.length) {
      return
    } else {
      if (route.query.days) {
        getTours({ days: route.query.days })
      } else {
        getTours()
      }
    }
  })
}
getCatogries()

const order = ref("asc")
const categoriesCount = ref(null)
const getDaysCate = async () => {
  await getData(`categories/count`).then((res) => {
    categoriesCount.value = res.data
  })
}
getDaysCate()

const selectedDistinations = ref([])
const distinations = ref([])
const getAllDistination = async () => {
  await getData(`destinations?page_limit=200&parent.slug=egypt&order_by=display_order,asc`).then((res) => {
    distinations.value = res.data.data.map((dist) => {
      return {
        id: dist.id,
        title: dist.title,
        distination: dist.slug
      }
    })

    if (route.query.distination) {
      const thisDist = distinations.value.find((dist) => dist.distination == route.query.distination)
      selectedDistinations.value = [thisDist.id]
      selecterBtnsFilter.value = [...selecterBtnsFilter.value, thisDist]
    }
  })
}
getAllDistination()

const isShowAllDistination = ref(false)

const shownDistination = () => {
  if (distinations.value.length <= 5 || isShowAllDistination.value) {
    return distinations.value;
  } else {
    return distinations.value.slice(0, 5);
  }
};

const page = ref(1)
const getTours = async (values) => {
  isOpenFilterMobile.value = false
  if (process.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  isLoading.value = true
  tours.value = null
  let params = [`page=${page.value}`, `&page_limit=24`, `&exists=wishlisted`, `&order_by=display_order,${order.value}`]

  if (!selectedCatogries.value.length && selectedMainCatogry.value.length) {
    if (selectedMainCatogry.value[0] == 53) {
      params = [...params, `&categories.id%5B%5D=53`]
    } else {
      Categories.value.forEach(element => {
        params = [...params, `&categories.id%5B%5D=${element.id}`]
      });
    }
  } else if (selectedCatogries.value.length) {
    selectedCatogries.value.forEach(element => {
      params = [...params, `&categories.id%5B%5D=${element}`]
    });
  }

  if (selectedDistinations.value.length) {
    selectedDistinations.value.forEach(element => {
      params = [...params, `&destinations.slug%5B%5D=${distinations.value.find((dist) => dist.id == element).distination}`]
    });
  }


  if (MenuFilters.value.price) {
    params = values && values.min ? [...params, `&adult_price=gteq::${values.min}`] : [...params, `&adult_price=gteq::${initialValues.value.min}`]
    params = values && values.max ? [...params, `&adult_price=lteq::${values.max}`] : [...params, `&adult_price=lteq::${initialValues.value.max}`]
  }
  if (MenuFilters.value.days && selectedMainCatogry.value[0] == 3) {
    params = [...params, `&duration_in_days=${values.days}`]
  }
  if (selecterBtnsFilter.value.some((cate) => cate.id == 'thisTitle')) {
    params = [...params, `&title=*${route.query.title}*`]
  }

  const query = params.join("")
  await getData(`tours?${query}`).then((res) => {
    tours.value = res.data
    isLoading.value = false
  })
}

watch(selecterBtnsFilter, () => {
  if (Categories.value.length > 0 || selectedMainCatogry.value[0] == 53) {
    page.value = 1
    if (route.query.days) {
      getTours({ days: route.query.days })
    } else {
      getTours()
    }
  }

})
watch(order, () => {
  page.value = 1
  if (route.query.days) {
    getTours({ days: route.query.days })
  } else {
    getTours()
  }
})

watch(page, () => {
  console.log("page changed")
  if (route.query.days) {
    getTours({ days: route.query.days })
  } else {
    getTours()
  }
})

const submit = (values) => {
  getTours(values)
}

watch(selecterBtnsFilter, (oldVal, newVal) => {
  const difference = oldVal.filter((val) => !newVal.includes(val))
})

const clearAll = () => {
  page.value = 1
  selectedCatogries.value = []
  selectedDistinations.value = []
  selectedMainCatogry.value = []
  selecterBtnsFilter.value = []
  getCatogries()
}
</script>

<style scoped lang="scss"></style>
