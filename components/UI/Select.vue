<template>
  <div class="flex flex-col gap-3 relative"
    :class="[props.dynamicLabel ? `inputBase ${meta.touched && !meta.valid ? '!border-red-500 !text-red-500' : ''}` : '', props.isNotFullWidth ? '' : 'w-full']">
    <label class=" font-medium w-fit" v-if="props.label" :for="name"
      :class="[props.isRequired ? 'isRequiredSign' : '']">{{
        props.label }}</label>

    <ClientOnly>
      <Menu as="div" class="group w-full">
        <MenuButton @click="focusInput" type="button" class="w-full" :class="[
          meta.touched && !meta.valid ? '!border-red-500 !text-red-500' : '',
          props.dynamicLabel ? 'w-full py-1' : 'inputBase',
          ...(props.classes ?? []),
        ]">
          <div class="w-full flex justify-between relative items-center"
            :class="[props.name == 'order' ? 'group-hover:text-white' : '']">
            <MenuButton @click="focusInput" type="button"
              class="flex relative gap-1 w-full justify-between items-start rounded-md font-medium focus:outline-none"
              :class="[props.dynamicLabel ? 'relative' : '']">
              <input v-if="true" type="text" name="" ref="inputRef"
                class="focus:outline-none w-full h-full bg-transparent ps-[1px]" v-model="searchQuery"
                :placeholder="props.placeholder" :class="[...(props.placeholderClasses ?? [])]" />

            </MenuButton>

            <button v-if="fieldValue" type="button" @click="clearField"
              class="absolute top-1/2 border rounded-full bg-primary/20 -translate-y-1/2 rotate-45 right-8">
              <NuxtIcon name="add" class="text-primary text-xl" />
            </button>

            <MenuButton @click="focusInput">
              <NuxtIcon type="button" name="arrow-down" class="w-5 text-xl mb-0 ms-auto" alt="arrow_down" />
            </MenuButton>

            <MenuButton v-if="props.dynamicLabel" @click="focusInput" class="font-normal absolute transition-all"
              :class="[
                isUp && searchQuery
                  ? '-top-3 start-0 text-xs'
                  : 'top-0 text-textLight start-4',
              ]">
              {{ props.dynamicLabel }}
            </MenuButton>
          </div>
        </MenuButton>

        <transition enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0" @closed="meta.touched = true">
          <MenuItems
            class="absolute top-full z-10 max-h-36 overflow-y-auto right-0 mt-0 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 w-full ring-black/5 focus:outline-none">
            <div class="py-1 w">
              <template v-if="getData(props.items).length">
                <MenuItem v-slot="{ active }" v-for="item in getData(props.items)" :key="item.id">
                <button @click="fieldValue = props.value ? item[props.value] : item, emits('click', fieldValue)"
                  v-bind="field" type="button"
                  class="group hover:bg-secondary/60 hover:text-white !text-textDark flex justify-start gap-2 w-full items-center px-2 py-2 text-sm border-b border-b-textLight/10"
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
      {{
        $t("errors.isRequired", {
          name: $t(props.label ?? props.dynamicLabel),
        })
      }}
    </div>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { useField } from "vee-validate";

const emits = defineEmits(['click'])

const inputRef = ref(null)
const searchQuery = ref("")

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
    type: Array,
    required: false,
  },
  placeholderClasses: {
    type: Array,
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
  dynamicLabel: {
    type: String,
    required: false,
  },
  isNotFullWidth: {
    type: Boolean,
    required: false,
  }, isRequired: {
    type: Boolean,
    required: false,
  },
});

const { value: fieldValue, meta } = useField(props.name);
const isUp = ref(false);

const getTitle = computed(() => {
  if (props.items.length && fieldValue.value) {
    return props.value
      ? props.items.find((item) => item[props.value] == fieldValue.value)?.[
      props.title
      ]
      : fieldValue.value;
  } else {
    return ""
  }
});

const isFirstTime = ref(true);

watch(searchQuery, (newVal) => {
  if (newVal) {
    if (isFirstTime.value) {
      fieldValue.value = props.items.find((item) => item[props.title] == newVal)?.[props.value] ?? ""
      isFirstTime.value = false;
    }
  } else {
    fieldValue.value = ""
  }
})

const focusInput = () => {
  setTouched()
  setTimeout(() => {
    inputRef.value.focus()
  }, 100)
}

if (props.items.length && fieldValue.value) {
  searchQuery.value = props.items.find((item) => item[props.value] == fieldValue.value)?.[props.title] ?? ""
}

watch(fieldValue, (newVal) => {
  if (newVal) {
    searchQuery.value = props.items.find((item) => item[props.value] == newVal)?.[props.title] ?? ""
  }
})
watch(() => props.items, (newVal) => {
  if (newVal) {
    searchQuery.value = props.items.find((item) => item[props.value] == fieldValue.value)?.[props.title] ?? ""
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

const getData = (items) => {
  if (searchQuery) {
    return items.filter((item) => {
      return item[props.title].toLowerCase().includes(searchQuery.value.toLowerCase())
    })
  } else {
    return items
  }
}

const setTouched = () => {
  isUp.value = true;
  setTimeout(() => {
    meta.touched = true;
  }, 300);
};
</script>

<style scoped lang="scss">
.input {
  @apply border px-7 py-[11px] bg-white rounded-[34px] flex gap-2 items-center;
}
</style>
