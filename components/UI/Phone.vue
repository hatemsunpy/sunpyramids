<template>
  <ClientOnly>
    <div class="">
      <div class="flex flex-col gap-3 relative">
        <label v-if="title" class="text-base font-medium w-fit" :class="[isRequired ? 'isRequiredSign' : '']"
          :for="name">{{
            title
          }}</label>
        <div class="inputBase" :class="[
          classes,
          is_phone_error ? '!border-red-500 !text-red-500' : '',
          dynamicLabel ? '!py-5' : '',
        ]">
          <Menu as="div" class="relative flex items-center justify-center rounded-xl text-left me-2">
            <div>
              <MenuButton @click="focusInput"
                class="flex relative gap-1 w-full justify-center items-center rounded-md bg-white px-4 text-sm font-medium text-black focus:outline-none">
                <img :src="`https://flagcdn.com/w40/${country?.code.toLowerCase()}.png`"
                  class="w-6 h-6 rounded-full me-1 object-cover object-center" :alt="country?.code" />
                <!-- <div class=" w-6 h-6 flex justify-center items-center rounded-full bg-primary text-white">
                  <span class="!text-xs">{{ country?.code }}</span>
                </div> -->

                <p class="me-2">{{ country?.phone_code }}</p>
                <!-- <input v-if="true" type="text" name="" ref="inputRef"
                  class="focus:outline-none !w-10 h-full bg-transparent ps-[1px]" v-model="selectedCode" /> -->


                <NuxtIcon name="arrow-down" class="text-sm w-[14px] h-[14px]" />

                <p class="border-[#EEEEEE] border rounded overflow-hidden absolute -end-1 w-[1px] h-11"></p>
              </MenuButton>
            </div>

            <transition enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0">
              <MenuItems
                class="absolute top-full z-10 max-h-44 w-52 overflow-y-auto sm:-right-5 -right-28 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1  ring-black/5 focus:outline-none">
                <div class="px-1 py-1 w">
                  <div>
                    <input type="text" name="" ref="inputRef"
                      class="focus:outline-none w-full sticky top-1 bg-white py-2 !px-1 h-full border w bg-transparent ps-[1px]"
                      v-model="SearchQuery" />
                  </div>

                  <MenuItem v-slot="{ active }" v-for="country in getfilteredData(countries)" :key="country.langth">
                  <button type="button"
                    class="group flex justify-between gap-2 w-full items-center rounded-md px-2 py-2 text-sm"
                    @click="changePhoneCode(country)">
                    <img :src="`https://flagcdn.com/w40/${country?.code.toLowerCase()}.png`"
                      class="w-6 h-6 rounded-full me-1 object-cover" :alt="country?.code" />


                    <p>{{ country?.name }} ( {{ country?.phone_code }} )</p>
                  </button>
                  </MenuItem>

                  <div v-if="getfilteredData(countries).length == 0" class="text-center text-red-500 text-sm">
                    There are no data
                  </div>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <vee-field :name="name" v-slot="{ field, meta }">
            <div class="w-full relative group">
              <input :id="specialID" v-bind="field" type="number" :placeholder="placeholder"
                class="w-full focus:outline-none ps-4 font-medium" :size="12" maxlength="10" min="10" required="" />

              <label :for="specialID"
                class="dynamicLabel font-normal absolute transition-all group text-textLight start-4 top-0"
                v-if="dynamicLabel">{{ dynamicLabel }}</label>
            </div>

            {{ phone_error(meta.touched && !meta.valid) }}
          </vee-field>
        </div>

        <span v-if="is_phone_error" class="errorStyle">{{
          errors[name] ?? null
        }}</span>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

let { title, name, placeholder, dynamicLabel, classes, index, errors, isRequired } =
  defineProps([
    "title",
    "name",
    "placeholder",
    "dynamicLabel",
    "classes",
    "index",
    "errors",
    "isRequired",
  ]);
let emit = defineEmits(["changePhoneLength"]);
const { getData } = useApi()
let countries = ref([
]);
let country = ref(null);
// changePhoneCode(country.value);
let is_phone_error = ref(null);
const inputRef = ref(null);
let selectedCode = ref("");
const SearchQuery = ref("");

await getData("countries").then((res) => {
  countries.value = res.data;
  country.value = res.data[0];
  selectedCode.value = res.data[0].phone_code;
  emit("changePhoneLength", {
    index: index,
    length: res.data[0],
  });
});

const specialID = `${name}-${Date.now()}`;

function changePhoneCode(e) {
  country.value = e;
  selectedCode.value = e.phone_code;
  SearchQuery.value = "";
  emit("changePhoneLength", {
    index: index,
    length: country.value,
  });
}

function phone_error(e) {
  is_phone_error.value = e;
}

const focusInput = () => {
  SearchQuery.value = ""
  setTimeout(() => {
    inputRef.value.focus()
  }, 200)
}

const getfilteredData = (items) => {
  if (SearchQuery.value) {
    return items.filter((item) =>
      item.name.toLowerCase().includes(SearchQuery.value.toLowerCase())
    )
  } else {
    return items
  }
}

const updatePhoneLength = (id) => {
  const country = countries.value.find((c) => c.id === id);
  changePhoneCode(country);
}


defineExpose({
  updatePhoneLength
})
</script>

<style scoped lang="scss">
:is(input:focus, input:valid)~label {
  transform: translateX(-45%) translateY(-80%);
  color: #1d1f1f;
  font-size: 12px;
}
</style>
