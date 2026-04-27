<template>
  <div class="w-full h-36 flex justify-center items-center">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang='js'>

</script>

<style scoped lang='scss'>
.spinner {
  width: 8px;
  height: 8px;
  border-radius: 8px;
  box-shadow: 20px 0px 0 0 rgba(22, 58, 150, 0.2), 16.2px 11.8px 0 0 rgba(22, 58, 150, 0.4), 6.2px 19px 0 0 rgba(22, 58, 150, 0.6), -6.2px 19px 0 0 rgba(22, 58, 150, 0.8), -16.2px 11.8px 0 0 #ffffff;
  animation: spinner-b87k6z 1s infinite linear;
}

@keyframes spinner-b87k6z {
  to {
    transform: rotate(360deg);
  }
}
</style>