<template>
  <div class="xl:px-20  px-4 py-12 bg-[#ffffff]">
    <div class="w-full h-full bg-[#fef3e6] p-2 pt-4 rounded-[2rem]">
      <div class="w-full flex justify-center items-center gap-2 mb-4">
        <NuxtIcon name="discount" class="text-secondary text-[2rem]" />

        <h4 class="text-[2.125rem] font-medium">Tour Prices </h4>
      </div>

      <div v-if="data"
        class="bg-[#ffffff] p-4 rounded-3xl grid  gap-5 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2 grid-cols-1">
        <div class="bg-[#f9fafb] py-4 px-2 rounded-[1.25rem]" v-for="item in data">
          <div class="w-full flex justify-start items-center gap-1 mb-4">
            <NuxtIcon name="calender" class="text-textDark text-xl w-5 h-5" />

            <p class="font-medium">{{ item.day_numbers && item.day_numbers.length ? `(${item.day_numbers[0]} -
              ${item.day_numbers[item.day_numbers.length-1]})`:'' }} {{
                item.date }}</p>
          </div>

          <div class="bg-[#ffffff] py-2 rounded-xl">
            <div class="px-3 border-b py-2 flex justify-between items-center border-b-[#F9FAFB]">
              <p class="font-medium">Solo</p>

              <div class="flex items-center gap-1">
                <p class="font-medium">{{ (item.solo * selectedCurrancies.exchange_rate).toFixed(2) }}{{
                  selectedCurrancies.symbol }}</p>

                <p class="text-sm text-textLight">{{ selectedCurrancies.name }}</p>
              </div>
            </div>

            <div v-for="(ele, index) in item.many"
              class="px-3 border-b py-2 flex justify-between items-center border-b-[#F9FAFB]">
              <div class="flex items-center gap-1">
                <p class="font-medium">{{ ele.count }}</p>

                <p class="text-sm text-textLight">PAX</p>
              </div>

              <div class="flex items-center gap-1">
                <p class="font-medium">{{ (ele.value * selectedCurrancies.exchange_rate).toFixed(2) }}{{
                  selectedCurrancies.symbol }}</p>

                <p class="text-sm text-textLight">{{ selectedCurrancies.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='js'>
import { sharedStore } from '~/stores/sharedStore.js'
import { storeToRefs } from 'pinia'
const props = defineProps({
  tour: {
    type: Object,
    required: true
  }
})
const data = ref(null)
const tour = ref(null)
watch(() => props.tour, (newVal) => {
  if (newVal) {
    tour.value = newVal
    data.value = formatSeasonsSummary(newVal.seasons);
  }
}, {
  deep: true,
  immediate: true
})

function formatSeasonsSummary(seasons) {
  const monthOrder = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

  const shortMonthMap = {
    january: "Jan",
    february: "Feb",
    march: "Mar",
    april: "Apr",
    may: "May",
    june: "Jun",
    july: "Jul",
    august: "Aug",
    september: "Sep",
    october: "Oct",
    november: "Nov",
    december: "Dec"
  };

  const results = [];

  seasons.forEach(season => {
    const availability = season.calender_availability;
    const pricingGroups = season.pricing_groups;

    const soloGroup = pricingGroups.find(g => g.from === 1 && g.to === 1);
    const manyGroups = pricingGroups.filter(g => !(g.from === 1 && g.to === 1));

    const years = (availability.years_numbers || []).sort();
    const months = (availability.month_names || []).sort(
      (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
    );

    if (months.length === 1) {
      const shortMonth = shortMonthMap[months[0]];
      if (years.length === 1) {
        results.push({
          date: `${shortMonth} ${years[0]}`,
          solo: soloGroup?.price ?? null,
          day_numbers: season.calender_availability.day_numbers,
          many: manyGroups.map(g => ({
            count: `${g.from}-${g.to}`,
            value: g.price
          }))
        });
      } else {
        const yearList = years.join(' & ');
        results.push({
          date: `${shortMonth} ${yearList}`,
          solo: soloGroup?.price ?? null,
          day_numbers: season.calender_availability.day_numbers,
          many: manyGroups.map(g => ({
            count: `${g.from}-${g.to}`,
            value: g.price
          }))
        });
      }
    } else {
      years.forEach(year => {
        const startMonth = shortMonthMap[months[0]];
        const endMonth = shortMonthMap[months[months.length - 1]];
        results.push({
          date: `From ${startMonth} ${year} to ${endMonth} ${year}`,
          solo: soloGroup?.price ?? null,
          day_numbers: season.calender_availability.day_numbers,
          many: manyGroups.map(g => ({
            count: `${g.from}-${g.to}`,
            value: g.price
          }))
        });
      });
    }
  });

  return results;
}


const { selectedCurrancies } = storeToRefs(sharedStore())

</script>

<style scoped lang='scss'></style>