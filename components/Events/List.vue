<template>
  <section v-if="events && events.length"
    class="grid xl:grid-cols-6 md:grid-cols-2 grid-cols-1 gap-6 py-8 xl:pb-20   px-4 xl:px-20">
    <EventsEventCard v-for="(event, index) in events" :data="event" :key="event"
      :class="getColSpan(index, events.length)" />
  </section>
</template>

<script setup lang='js'>
const { getData } = useApi()

const events = ref(null)
events.value = await getData('categories?parent_id=55&page_limit=100').then((res) => {
  return res.data.data
})

function getColSpan(index, total) {
  if (total === 1 || total === 2 || total === 4) return 'col-span-1 md:col-span-1 xl:col-span-3';

  if (total === 3 || total === 6 || total === 9) return 'col-span-1 md:col-span-1 xl:col-span-2';

  if (total === 5 || total === 8) return index < 2 ? 'col-span-1 md:col-span-1 xl:col-span-3' : 'col-span-1 md:col-span-1 xl:col-span-2';

  if (total === 7) return index < 4 ? 'col-span-1 md:col-span-1 xl:col-span-3' : 'col-span-1 md:col-span-1 xl:col-span-2';

  // fallback
  return 'col-span-1';
}
</script>

<style scoped lang='scss'></style>