<template>
  <client-only>
    <div class="flex items-center cursor-pointer gap-4 relative px-8 py-2 w-full border-dark border rounded-[3.5rem]"
      :class="meta.touched && !meta.valid ? 'border-red-500' : 'border-dark'" @click="DatePickerInput.toggleMenu()">
      <div class="flex flex-col  w-full" :class="[props.isEdit ? 'gap-1' : 'gap-2']">
        <label class="text-sm xl:text-base cursor-pointer">
          {{ props.title }}
        </label>
        <VueDatePicker :auto-apply="true" :auto-position="props.istop ? 'top' : ''" ref="DatePickerInput"
          :disabled="props.disabled"
          :format="props.isMonth ? 'MMMM, yyyy' : props.isTime ? 'MMMM dd, yyyy hh:mm a' : 'dd/MM/yyyy'"
          :min-date="props.minDate" :max-date="props.maxDate" :disabled-dates="disableExceptSpecificDates"
          :name="props.name" v-model="fieldValue" :placeholder="props.placeholder" :month-picker="props.isMonth"
          :enable-time-picker="props.isTime" @closed="meta.touched = true" class="font-medium ms-[1px]" />
      </div>
      <NuxtIcon v-if="props.icon" :name="props.icon"
        class="min-w-fit text-xl w-5 h-5  cursor-pointer"
        :class="[props.disabled ? 'cursor-not-allowed' : '', meta.touched && !meta.valid ? 'text-red-500' : 'text-textLight']" />

      <div v-if="meta.touched && !meta.valid" class="errorStyle">
        {{ $t("errors.isRequired", { name: $t(props.label) }) }}
      </div>
    </div>
  </client-only>
</template>

<script setup lang="js">
import { useField } from 'vee-validate'

import VueDatePicker from '@vuepic/vue-datepicker';

const props = defineProps({
  icon: {
    type: String,
    required: false,
    default: 'calendar'
  },
  minDate: {
    type: Date,
    required: false,
    default: new Date()
  },
  maxDate: {
    type: Date,
    required: false,
  },
  condition: {
    type: Function,
    required: false,
  },
  title: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    default: '',
  },
  label: {
    type: String,
    required: true,
    default: '',
  },
  minimumView: {
    type: String,
    required: false,
    default: 'day'
  },
  placeholder: {
    type: String,
    required: false,
    default: ''
  },
  type: {
    type: String,
    required: false,
    default: 'data'
  },
  isTime: {
    type: Boolean,
    required: false,
    default: false
  },
  isMonth: {
    type: Boolean,
    required: false,
    default: false
  },
  isEdit: {
    type: Boolean,
    required: false,
    default: false
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  istop: {
    type: Boolean,
    required: false,
    default: true
  }
})

const emits = defineEmits(["update:value"])

const { value: fieldValue, meta } = useField(props.name)
const DatePickerInput = ref(null);

watch(fieldValue, (newVal) => {
  if (newVal) emits("update:value", newVal)
})



const disableExceptSpecificDates = (date) => {
  const day = date.getDate();
  return props.condition ? props.condition(date) : false;
}
</script>

<!-- <style lang="scss">
.v3dp__datepicker {
  @apply w-full;

  .v3dp__element__button__day,
  .v3dp__element__button__month,
  .v3dp__element__button__year {
    &:hover {
      span {
        background-color: #163a96 !important;
      }
    }
  }

  .v3dp__elements button.selected span {
    background-color: #163a96 !important;
  }
}

.v3dp__input_wrapper {
  @apply w-full;

  input {
    @apply focus:outline-none w-full cursor-pointer;
  }
}

.v3dp__popout {
  @apply z-50 relative bottom-0;
}

.dp__active_date,
.dp__overlay_cell_active {
  @apply bg-primary;
}

.dp__disabled {
  @apply bg-transparent cursor-not-allowed !important;
}

.dp__action_select {
  background-color: #f7951d !important;
}

.dp__input_reg {
  @apply p-0 border-none font-medium
}

.dp__input_reg::placeholder {
  @apply text-textLight font-medium opacity-100;
  // #{!important}
}

.dp__input_icons {
  @apply hidden
}
</style> -->
