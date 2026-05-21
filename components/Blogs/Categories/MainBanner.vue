<template>
  <section>
    <div class="w-full h-[16.6875rem] flex relative items-end ">

      <div class="w-full h-full absolute top-0 categoryBox start-0">
        <img class="w-full h-full  object-cover object-top z-0" :src="props.image" alt="" />

        <div class="absolute bottom-0 start-0 w-full h-[70%] categoryBox"></div>
      </div>


      <h1 class="lg:text-[3rem] text-3xl text-white z-10 lg:px-20 px-4 pb-11 font-bold textShadow">
        {{ $t("labels.blogs") }}
      </h1>
    </div>
  </section>
</template>

<script setup lang="js">
const props = defineProps({
  image: {
    type: String,
    default: "",
  },
})

</script>

<style scoped lang="scss">
.textShadow {
  text-shadow: 0 4px 40px #00000066, 0 4px 24px #00000033;
}

.categoryBox {
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.363),
      rgba(0, 0, 0, 0.726));
}
</style>
