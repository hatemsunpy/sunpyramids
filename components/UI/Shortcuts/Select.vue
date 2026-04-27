<template>
  <div class="flex items-center gap-4 relative px-8 py-2 w-full border-dark border rounded-[3.5rem]">
    <div class="flex flex-col gap-2 w-full">
      <ClientOnly>
        <Menu as="div" class="relative ">
          <MenuButton @click="focusInput"
            class="flex w-full cursor-pointer items-center justify-center rounded-xl text-left">
            <div class="flex flex-col gap-2 w-full">
              <label class="text-sm xl:text-base" :for="name">{{
                props.label
                }}</label>

              <div type="button"
                class="flex relative gap-1 w-full justify-between items-start rounded-md bg-white font-medium focus:outline-none">
                <!-- <p v-if="getTitle" class="ms-[1px] ">
                  {{ getTitle }}
                </p> -->

                <input v-if="true" type="text" name="" ref="inputRef"
                  class="focus:outline-none w-full h-full bg-transparent ps-[1px]" v-model="searchQuery"
                  :placeholder="props.placeholder" :class="[...(props.placeholderClasses ?? [])]" />

                <p v-else class="ms-[1px] text-textLight">
                  {{ props.placeholder }}
                </p>

                <button v-if="fieldValue" type="button" @click="clearField"
                  class="absolute top-1/2 border rounded-full bg-primary/20 -translate-y-full rotate-45 right-8">
                  <NuxtIcon name="add" class="text-primary text-xl" />
                </button>
              </div>
            </div>

            <div>
              <NuxtIcon type="button" name="arrow-down" class="w-5 text-xl mb-0 ms-auto" alt="arrow_down" />
            </div>
          </MenuButton>
          <transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0" @closed="meta.touched = true">
            <MenuItems
              class="absolute top-full z-10 max-h-36 overflow-y-auto right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 w-full ring-black/5 focus:outline-none">
              <div class="py-1 w">
                <template v-if="getData(props.items).length">
                  <MenuItem v-slot="{ active }" v-for="item in getData(props.items)" :key="item.id">
                  <button @click="fieldValue = props.value ? item[props.value] : item, emits('click')" v-bind="field"
                    type="button"
                    class="group hover:bg-secondary/60 hover:text-white flex justify-start gap-2 w-full items-center px-3 py-2 text-sm border-b border-b-textLight/10"
                    :class="[
                      fieldValue == item[props.value] || fieldValue == item
                        ? 'bg-secondary text-white'
                        : '',
                    ]">
                    <p>{{ props.title ? item[props.title] : item }}</p>
                  </button>
                  </MenuItem>
                </template>

                <p class="hover:bg-secondary/60 hover:text-white flex justify-center gap-2 w-full items-center px-2 py-2 text-sm border-b border-b-textLight/10"
                  v-else>There is no data, yet</p>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </ClientOnly>

      <div v-if="meta.touched && !meta.valid" class="errorStyle">
        {{ $t("errors.isRequired", { name: $t(props.label) }) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { useField } from "vee-validate";

const inputRef = ref(null)
const searchQuery = ref("")

const emits = defineEmits(['click'])

let props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
  },
  classes: {
    type: String,
    required: false,
  },
  value: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  items: {
    type: Array,
    required: true,
  },
});

const { value: fieldValue, meta } = useField(props.name);

const focusInput = () => {
  setTouched()
  setTimeout(() => {
    inputRef.value.focus()
  }, 100)
}

watch(fieldValue, (newVal) => {
  if (newVal) {
    searchQuery.value = props.items.find((item) => item[props.value] == newVal)?.[props.title] ?? ""
  }
})

watch(searchQuery, (newVal) => {
  if (newVal) {
    fieldValue.value = props.items.find((item) => item[props.title] == newVal)?.[props.value] ?? ""
  } else {
    fieldValue.value = ""
  }
})

const clearField = () => {
  searchQuery.value = ""
  fieldValue.value = ""
  isUp.value = false
  setTimeout(() => {
    meta.touched = true;
  }, 300);
}


const getTitle = computed(() => {
  if (props.items.length) {
    return props.value
      ? props.items.find((item) => item[props.value] == fieldValue.value)?.[
      props.title
      ]
      : fieldValue.value;
  } else {
    return ""
  }
});

const setTouched = () => {
  setTimeout(() => {
    meta.touched = true;
  }, 300);
};

const getData = (items) => {
  if (searchQuery) {
    return items.filter((item) => {
      return item[props.title].toLowerCase().includes(searchQuery.value.toLowerCase())
    })
  } else {
    return items
  }
}
</script>

<style scoped lang="scss">
.input {
  @apply border px-7 py-[11px] bg-white rounded-[34px] flex gap-2 items-center;
}
</style>
