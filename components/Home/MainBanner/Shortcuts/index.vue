<template>
  <div  class="2xl:mx-44 lg:mx-12 mx-12 relative lg:block hidden">
    <div class="flex items-end gap-[1px] absolute -top-[3.30rem] start-[4.5rem] max-h-fit max-w-fit">
      <HomeMainBannerShortcutsTopTap v-for="(item, index) in tabs" :key="item.index" :title="$t('labels.' + item.title)"
        :value="item.value" @changeValue="currentValue = $event" :currentValue="currentValue" />
    </div>
    <component :is="selectedComponent" />
  </div>
</template>

<script setup lang="js">
import MakeYourTrip from './MakeYourTrip.vue';
import RentCar from './RentCar.vue';
import FindYourTrip from './FindYourTrip.vue';
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
})
const currentValue = ref('MakeYourTrip');
const selectedComponent = computed(() => {
  return tabs.find((tab) => tab.value === currentValue.value).component;
});
const tabs = [{ title: "makeYourTrip", value: "MakeYourTrip", component: MakeYourTrip }, { title: "findYourTrep", value: "FindYourTrip", component: FindYourTrip }, { title: "rentcar", value: "RentCar", component: RentCar },]
</script>

<style scoped lang="scss"></style>
