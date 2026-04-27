<template>
  <section
    class=" absolute bottom-0 start-0 z-20 w-full grid lg:hidden grid-cols-3 gap-2 translate-y-1/2 justify-between items-center px-4 ">
    <div v-for="item in data" :key="item.name" @click="router.push(localePath(item.path))"
      class="overflow-hidden rounded-3xl cursor-pointer    hover:border-none transition-all duration-300 p-[1px]">
      <div
        class="flex flex-col items-center gap-2 py-6 bg-[#fafafa] border-[#EEEEEE]  group-hover:bg-white group-hover:scale-105 group-hover:-translate-x-[4px] border-[1px] transition-all rounded-3xl  duration-300">
        <NuxtIcon :name="item.icon" class="md:text-2xl text-xl text-primary" />

        <p class="text-primary md:text-base font-medium text-sm">{{
          $t(`labels.${item.name}`) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="js">
const router = useRouter()
const localePath = useLocalePath()
const data = [{ name: "makeTripShort", icon: "airplane", path: "/make-your-trip" }, { name: "findTripShort", icon: "search-normal", path: "/trips" }, { name: "rentCarShort", icon: "car", path: "/rent-car" },]
</script>

<style scoped lang="scss"></style>