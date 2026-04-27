<template>
  <div class="my-12">
    <ToursSharedHeader :expand="false" :title="$t('labels.tours.addOns')">
      <div class="mt-4 flex flex-col gap-3" v-if="tour">
        <div v-for="item in tour.options" class="cntr flex gap-2 md:items-end items-start group w-fit mb-2">
          <input v-model="addsValues" :value="item.id" type="checkbox" :id="item.id + '-addons-components'"
            name="catogriess" class="hidden-xs-up cbxInput" />
          <label :for="item.id + '-addons-components'"
            class="cbx group-hover:border-[#c57007]  checked: transition-colors"></label>
          <label :for="item.id + '-addons-components'"
            class="font-medium text-xl flex  md:flex-row flex-col md:gap-10 md:justify-between  justify-end cursor-pointer  group-hover:text-[#c57007] transition-colors"
            :class="[addsValues.includes(item.id) ? 'text-secondary' : 'text-textDark']">
            <p class="lg:min-w-[420px] ">{{ item.name }}</p>
            <p>{{ selectedCurrancies.symbol }}{{ (item.adult_price * selectedCurrancies.exchange_rate).toFixed(2) }}</p>
          </label>
        </div>
      </div>
    </ToursSharedHeader>
  </div>
</template>

<script setup lang='js'>
import { sharedStore } from '~/stores/sharedStore.js'
import { storeToRefs } from 'pinia'
const props = defineProps({
  tour: {
    type: Object
  },
  addsValues: {
    type: Array,
    default: () => []
  }
})

const tour = ref(null)
watch(() => props.tour, (newVal) => {
  if (newVal) tour.value = newVal
}, {
  deep: true,
  immediate: true
})

const { selectedCurrancies } = storeToRefs(sharedStore())

const addsValues = ref([])
const emits = defineEmits(['update:adds'])
watch(addsValues, () => {
  emits('update:adds', addsValues.value)
})

watch(() => props.addsValues, (newVal) => {
  addsValues.value = newVal
}, {
  deep: true,
  immediate: true
})
</script>

<style scoped lang='scss'>
.cbx {
  position: relative;
  top: 1px;
  width: 28px;
  height: 28px;
  border: 2px solid #a5a5a5;
  border-radius: 0.6125rem;
  vertical-align: middle;
  cursor: pointer;
  display: block;
}

.cbx:hover {
  border-color: #c57007;
}

.cbx:after {
  content: "";
  position: absolute;
  top: 3px;
  left: 9px;
  width: 7px;
  height: 14px;
  opacity: 0;
  transform: rotate(45deg) scale(0);
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}

.lbl {
  margin-left: 5px;
  vertical-align: middle;
  cursor: pointer;
}

.cbxInput:checked~.cbx {
  border-color: transparent;
  background: #f7951d;

  &:hover {
    background-color: #c57007;
    transition: all 0.1s ease;
  }

  @apply group-hover:bg-[#c57007];
}

.cbxInput:checked~.cbx:after {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.cntr {
  position: relative;
}

.hidden-xs-up {
  display: none !important;
}
</style>