<template>
  <div class="w-full flex justify-center bg-black items-center">
    <div v-if="!isStarted" class="relative w-full" :class="[props.height]"><img :src="props.photo" alt=""
        class="w-full h-full object-cover" :class="[props.height]" loading="lazy" width="800" height="450" style="aspect-ratio: 16 / 9;" />

      <div @click="isStarted = true"
        class="absolute bg-[#1D1F1FCC]  cursor-pointer flex justify-center items-center  rounded-full w-[4.5rem] h-[4.5rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <NuxtIcon name="play" class="text-white text-[2rem]" />
      </div>
    </div>

    <div v-else class="relative group w-full" :class="[props.height]">
      <video autoplay class="!w-full" :class="[props.height]" ref="video">
        <source src="../../public/images/test-video.mp4" type="video/mp4" />
      </video>

      <button @click="handdleVideo"
        class="absolute bg-[#1D1F1FCC] opacity-0 group-hover:opacity-100 transition cursor-pointer flex justify-center items-center  rounded-full w-[4.5rem] h-[4.5rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <NuxtIcon :name="isPlaying ? 'pause' : 'play'" class="text-white text-[2rem]" />

      </button>
    </div>
  </div>
</template>

<script setup lang='js'>
import { string } from 'yup';


const props = defineProps({
  video: String,
  photo: String,
  timeNow: Number,
  height: String
})
const isPlaying = ref(true)
const isStarted = ref(false)
const video = ref();


function handdleVideo() {
  if (video.value.paused) {
    video.value.play();
    isPlaying.value = true;
  } else {
    video.value.pause();
    isPlaying.value = false;
  }
}



watch(() => props.timeNow, () => {
  if (video.value) {
    video.value.pause();
    isPlaying.value = false;
  }
})
watch(video, () => {
  if (video.value) {
    video.value.addEventListener("ended", () => {
      isPlaying.value = false;
    });
  }
})

</script>

<style scoped lang='scss'></style>