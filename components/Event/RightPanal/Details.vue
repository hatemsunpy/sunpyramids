<template>
  <div class="w-full  bg-white boxShadowRightPanal rounded-t-xl rounded-b-lg overflow-hidden">
    <div class="bg-primary p-[6px] text-center">
      <h3 class="font-medium text-lg text-white">{{ $t("labels.event.eventDetails") }}</h3>
    </div>

    <div>
      <div class="p-2 px-4">
        <div class="flex gap-5 items-center  text-primary">
          <NuxtIcon name="calender" class="text-3xl " />

          <div>
            <p class="text-sm font-medium">{{ $t("labels.event.startDate") }}</p>

            <p class="text-lg ps-[1px]">{{ formatDate(props.data.date) }}</p>
          </div>
        </div>

        <hr class="w-full mt-3 ">
      </div>

      <div class="p-2 px-4">
        <div class="flex gap-5 items-center  text-primary">
          <NuxtIcon name="check" class="text-3xl " />

          <div>
            <p class="text-sm font-medium">{{ $t("labels.event.status") }}</p>

            <p class="text-lg ps-[1px]">{{ props.data.status ?? "" }}</p>
          </div>
        </div>

        <hr class="w-full mt-3 ">
      </div>

      <div class="p-2 px-4">
        <div class="flex gap-5 items-center  text-primary">
          <NuxtIcon name="location-filled" class="text-[26px] " />

          <div>
            <p class="text-sm font-medium">{{ $t("labels.event.location") }}</p>

            <p class="text-lg ps-[1px]">{{ props.data.location ?? "" }}</p>
          </div>
        </div>

        <hr class="w-full mt-3 ">
      </div>

      <div class="p-2 px-4">
        <div class="flex gap-5 items-center  text-primary">
          <NuxtIcon name="link" class="text-[26px] " />

          <div>
            <p class="text-sm font-medium">{{ $t("labels.event.website") }}</p>

            <p class="text-lg ps-[1px]">https://sunpyramidstours.com</p>
          </div>
        </div>

        <hr class="w-full mt-3 ">
      </div>

      <div class="p-2 px-4">
        <div class="flex gap-5 items-center  text-primary">
          <NuxtIcon name="phone" class="text-[30px] " />

          <div>
            <p class="text-sm font-medium">{{ $t("labels.event.phone") }}</p>

            <p class="text-lg ps-[1px] cursor-pointer">+20 109 588 8830</p>
          </div>
        </div>

        <hr class="w-full mt-3 ">
      </div>

      <div class="p-2 px-4 pb-4">
        <div class="flex gap-5 items-center  text-primary">
          <NuxtIcon name="email" class="text-[30px] " />

          <div>
            <p class="text-sm font-medium">{{ $t("labels.event.email") }}</p>

            <p class="text-lg ps-[1px] "><a href="mailto:info@sunpyramidstours.com">info@sunpyramidstours.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='js'>
const props = defineProps({
  data: {
    type: Object,
    default: () => { }
  }
})


function formatDate(dateStr) {
  try {
    if (dateStr) {
      const date = new Date(dateStr);

      if (isNaN(date.getTime())) {
        throw new Error(" Invalid date");
      }
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed const
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } else {
      return ""
    }
  } catch (error) {
    return `Invalid date format: ${error.message}`;
  }
} </script>

<style scoped lang='scss'>
.boxShadowRightPanal {
  box-shadow: 0px 8px 24px #00000014;
}
</style>
