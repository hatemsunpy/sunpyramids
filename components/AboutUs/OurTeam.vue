<template>
  <section class="xl:px-20 px-4 py-16">
    <h3 class="xl:text-5xl text-3xl font-bold text-center xl:mb-16 mb-4">
      {{ $t("labels.ourTeam") }}
    </h3>

    <div v-if="ourTeam.length"
      class="grid xl:grid-cols-5 md:grid-cols-3 lg:grid-cols-4  grid-cols-2 xl:gap-8 gap-6 gap-y-4">
      <div v-for="item in ourTeam" :key="item.name"
        class="col-span-1 py-8 flex flex-col items-center gap-4 border border-[#E6E6E6] rounded-[2rem]">
        <img :src="item.image" class="w-[8.5rem] h-[8.5rem] mx-auto rounded-3xl" />

        <h5 class="text-[#125E87] font-medium md:text-2xl text-center">{{ item.name }}</h5>

        <p class="text-[#666666] -mt-4 md:text-base text-xs text-center">{{ item.position }}</p>
      </div>
    </div>

    <UILoadingData v-else />
  </section>
</template>

<script setup lang="js">
const { getData } = useApi();

const ourTeam = ref([])

const getTeam = async () => {
  await getData("settings?option_key=company_team").then((res) => {
    ourTeam.value = res.data[0].option_value;
  });
};

getTeam()



</script>

<style scoped lang="scss"></style>
