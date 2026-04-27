<template>
<div class="flex items-end relative transition-all duration-75" :class="[props.currentValue == props.value ?'z-20':'z-10']">
<NuxtIcon :class="[props.currentValue == props.value ?'text-white ':'text-[#eeeeee] ']" name="tabEdge" class="transition-all duration-75 text-3xl h-[1.875rem] text-[#eeeeee]  absolute bottom-0 -start-[1.875rem] mb-0"/>

<UIButton @click="emits('changeValue' , props.value)" :classes="['px-14 transition-color  duration-75 rounded-t-[1.25rem] font-medium rounded-b-none' , props.currentValue == props.value ?'bg-white text-primary pb-4 pt-[0.875rem]':'bg-[#eeeeee] text-[#333333] pb-[0.875rem] pt-[0.875rem] text-textDark']" :text="props.title"/>

<NuxtIcon :class="[props.currentValue == props.value ?'text-white ':'text-[#eeeeee] ']"  name="tabEdge" class="transition-all duration-75 text-3xl h-[1.875rem] text-[#eeeeee] absolute bottom-0 -end-[1.875rem] mb-0 -scale-x-100"/>
</div>
</template>

<script setup lang='js'>
const props = defineProps({
  title:{
    type:String,
    required:true
  },
  value:{
    type:String,
    required:true,
  },
  currentValue:{
    type:String,
    required:true,
  }
})

const emits = defineEmits(['changeValue'])
</script>

<style scoped lang='scss'>


</style>