<template>
  <NuxtLayout name="default">
    <SharedError :title="error.statusMessage.split(':')[0]" :status="error.statusCode" />
  </NuxtLayout>
</template>

<script setup lang='js'>
const error = useError()
</script>

<style scoped lang='scss'></style>