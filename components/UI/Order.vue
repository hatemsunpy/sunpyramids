<template>
  <div class="flex flex-col gap-3 relative"
    :class="[props.dynamicLabel ? 'inputBase ' : '', props.isNotFullWidth ? '' : 'w-full']">
    <label class=" font-medium" v-if="props.label" :for="name">{{ props.label }}</label>

    <ClientOnly>
      <Menu as="div" class="group" :class="[
        meta.touched && !meta.valid ? '!border-red-500 !text-red-500' : '',
        props.dynamicLabel ? 'w-full py-1' : 'inputBase',
        ...(props.classes ?? []),
      ]">
        <div class="w-full flex justify-between relative items-center"
          :class="[props.name == 'order' ? 'group-hover:text-white' : '']">
          <MenuButton @click="setTouched" type="button"
            class="flex relative gap-1 w-full justify-between items-start rounded-md font-medium focus:outline-none"
            :class="[props.dynamicLabel ? 'relative' : '']">
            <p v-if="getTitle" class="ms-[1px]">
              {{ getTitle }}
            </p>

            <p v-else-if="props.placeholder && !getTitle" class="ms-[1px] text-textLight"
              :class="[...(props.placeholderClasses ?? [])]">
              {{ props.placeholder }}
            </p>
          </MenuButton>

          <MenuButton @click="setTouched">
            <NuxtIcon type="button" name="arrow-down" class="w-5 text-xl mb-0 ms-auto" alt="arrow_down" />
          </MenuButton>

          <MenuButton v-if="props.dynamicLabel" @click="setTouched" class="font-normal absolute transition-all" :class="[
            isUp && getTitle
              ? '-top-3 start-0 text-xs'
              : 'top-0 text-textLight start-4',
          ]">
            {{ props.dynamicLabel }}
          </MenuButton>
        </div>

        <transition enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0" @closed="meta.touched = true">
          <MenuItems
            class="absolute top-full z-10 max-h-36 overflow-y-auto right-0 mt-0 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 w-full ring-black/5 focus:outline-none">
            <div class="py-1 w">
              <template v-if="props.items.length">
                <MenuItem v-slot="{ active }" v-for="item in props.items" :key="item.id">
                <button @click="fieldValue = props.value ? item[props.value] : item, emits('click', fieldValue)"
                  v-bind="field" type="button"
                  class="group hover:bg-secondary/60 hover:text-white !text-textDark flex justify-center gap-2 w-full items-center px-2 py-2 text-sm border-b border-b-textLight/10"
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