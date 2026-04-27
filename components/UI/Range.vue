<script setup>
import { useField } from "vee-validate";

const props = defineProps({
  minName: {
    type: String,
    required: true,
  },
  maxName: {
    type: String,
    required: true,
  },
  step: {
    type: Number,
    required: false,
    default: 1,
  },
  title: {
    type: String,
    required: false,
  },
});

const { value: minValue } = useField(props.minName);
const { value: maxValue } = useField(props.maxName);

const range = {
  min: 0,
  max: 11000,
};
const selectedRange = ref({
  min: 0,
  max: 0,
});

const minChange = () => {
  if (
    Number(minValue.value) &&
    Number(minValue.value) >= Number(maxValue.value)
    && action.value == ""
  ) {
    minValue.value = Number(maxValue.value) - props.step;
  } else if (Number(minValue.value) && Number(minValue.value) <= range.min) {
    minValue.value = range.min + 1;
  }

  if (Number(minValue.value) && Number(minValue.value) <= range.min && (Number(maxValue.value) == 0 && action.value == "")) {
    maxValue.value = range.min + 1;
  }
};

const maxChange = () => {
  if (
    (Number(maxValue.value) && action.value == "" &&
      Number(maxValue.value) <= Number(minValue.value)) ||
    (Number(maxValue.value) && Number(maxValue.value) < 1 && action.value == "") ||
    (Number(maxValue.value) == 0 && action.value == "")
  ) {
    maxValue.value = Number(minValue.value) + props.step;
  } else if (Number(maxValue.value) && Number(maxValue.value) > range.max) {
    maxValue.value = range.max;
  }
};

watch(minValue, minChange);
watch(maxValue, maxChange);

const action = ref("")

watch(action, (newVal) => {
  if (newVal == "") {
    minChange();
    maxChange();
  }
});


const emits = defineEmits(["update:price"]);
</script>

<template>
  <p class="text-xl mb-5 font-medium">
    {{ props.title }}
  </p>

  <div class="flex justify-between mb-2">
    <p>{{ $t("inputLabels.min") }}</p>

    <p>{{ $t("inputLabels.max") }}</p>
  </div>
  <div class="flex gap-5">
    <UIText :isCenter="true" type="number" :name="props.minName" action="min" v-model:action="action" />

    <UIText :isCenter="true" type="number" :name="props.maxName" action="max" v-model:action="action" />
  </div>

  <div slider id="slider-distance">
    <div>
      <div inverse-left style="width: 70%"></div>
      <div inverse-right style="width: 70%"></div>
      <div range :style="{
        left: (Number(minValue) / range.max) * 100 + '%',
        right: 100 - (Number(maxValue) / range.max) * 100 + '%',
      }"></div>
      <span thumb :style="{ left: (Number(minValue) / range.max) * 100 + '%' }"></span>
      <span thumb :style="{ left: (Number(maxValue) / range.max) * 100 + '%' }"></span>

      <!-- <div sign :style="{ left: selectedRange.min + '%' }"></div>
      <div sign :style="{ left: selectedRange.max + '%' }"></div> -->
    </div>

    <input v-model="minValue" type="range" :max="range.max" :min="range.min" @input="minChange" :step="props.step" />

    <input v-model="maxValue" type="range" @input="maxChange" :max="range.max" :min="range.min" :step="props.step" />
  </div>
</template>

<style lang="scss" scoped>
[slider] {
  position: relative;
  height: 14px;
  border-radius: 10px;
  text-align: left;
  margin: 45px 0 10px 0;
}

[slider]>div {
  position: absolute;
  left: 13px;
  right: 15px;
  height: 14px;
}

[slider]>div>[inverse-left] {
  position: absolute;
  left: 0;
  height: 8px;
  border-radius: 10px;
  background-color: #eeeeee;
  margin: 0 7px;
}

[slider]>div>[inverse-right] {
  position: absolute;
  right: 0;
  height: 8px;
  border-radius: 10px;
  background-color: #eeeeee;
  margin: 0 7px;
}

[slider]>div>[range] {
  position: absolute;
  left: 0;
  height: 8px;
  border-radius: 14px;
  background-color: #f7951d;
}

[slider]>div>[thumb] {
  position: absolute;
  top: -14px;
  z-index: 2;
  height: 32px;
  width: 32px;
  text-align: left;
  margin-left: -11px;
  cursor: pointer;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
  background-color: white;
  border-radius: 50%;
  outline: none;
}

[slider]>input[type="range"] {
  position: absolute;
  pointer-events: none;
  -webkit-appearance: none;
  z-index: 3;
  height: 14px;
  top: -2px;
  width: 100%;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  filter: alpha(opacity=0);
  -moz-opacity: 0;
  -khtml-opacity: 0;
  opacity: 0;
  cursor: pointer;
}

div[slider]>input[type="range"]::-ms-track {
  -webkit-appearance: none;
  background: transparent;
  color: transparent;
}

div[slider]>input[type="range"]::-moz-range-track {
  -moz-appearance: none;
  background: transparent;
  color: transparent;
}

div[slider]>input[type="range"]:focus::-webkit-slider-runnable-track {
  background: transparent;
  border: transparent;
}

div[slider]>input[type="range"]:focus {
  outline: none;
}

div[slider]>input[type="range"]::-ms-thumb {
  pointer-events: all;
  width: 28px;
  height: 28px;
  border-radius: 0px;
  border: 0 none;
  background: red;
}

div[slider]>input[type="range"]::-moz-range-thumb {
  pointer-events: all;
  width: 28px;
  height: 28px;
  border-radius: 0px;
  border: 0 none;
  background: red;
}

div[slider]>input[type="range"]::-webkit-slider-thumb {
  pointer-events: all;
  width: 28px;
  height: 28px;
  border-radius: 0px;
  border: 0 none;
  background: red;
  -webkit-appearance: none;
}

div[slider]>input[type="range"]::-ms-fill-lower {
  background: transparent;
  border: 0 none;
}

div[slider]>input[type="range"]::-ms-fill-upper {
  background: transparent;
  border: 0 none;
}

div[slider]>input[type="range"]::-ms-tooltip {
  display: none;
}
</style>
