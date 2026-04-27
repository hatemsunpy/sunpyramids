<template>
  <section class="xl:px-20 px-4 py-16 bg-[#f9fafb]">
    <h3 class="xl:text-5xl text-3xl font-bold text-center lg:mb-16 mb-4">
      {{ $t("labels.aboutus.ceo.ceoMessage") }}
    </h3>

    <div class="py-16 xl:px-[7.5rem] px-4 messageReduis bg-[#ffffff]">
      <div class="flex justify-between mb-8">
        <div class="flex items-center gap-2">
          <NuxtImg src="/images/team/Mahmoud_badia.png" class="xl:w-16 w-10 xl:h-16 h-10 rounded-full" />
          <div>
            <h6 class="lg:text-xl text-xs lg:leading-8 leading-[160%] font-medium">Mahmoud Badia</h6>

            <p class="text-[#666666] lg:text-base text-[10px]">Executive Manager</p>
          </div>
        </div>

        <NuxtImg src="/images/team/doupleQuote.png" class="lg:w-20 lg:h-[3.375rem] h-10" />
      </div>

      <div class="text-xl flex flex-col gap-8">
        <p class="leading-8 text-[#A5A5A5]">
          {{ $t("labels.aboutus.ceo.value") }}
        </p>

        <p class="leading-8" v-html="props.data?.meta_value?.replace('\n', '<br/>')"></p>

        <!-- <p class="leading-8">{{ $t("labels.aboutus.ceo.one") }}</p> -->
        <!-- 
        <p class="leading-8">{{ $t("labels.aboutus.ceo.two") }}</p>

        <p class="leading-8">{{ $t("labels.aboutus.ceo.three") }}</p> -->

        <p class="leading-8 text-[#A5A5A5]">
          {{ $t("labels.aboutus.ceo.warm") }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="js">
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => ([])
  }
})
const team = [{ name: "Adly Ebrahim", image: "Adly_Ebrahim", role: "Responsible Manager" }, { name: "Mahmoud Badia", image: "Mahmoud_badia", role: "Executive Manager" }, { name: "Ahmed Abdelwahab", image: "Ahmed_Abdeltawab", role: "Finance Manager" }, { name: "Yasmin Ahmed", image: "Yasmin_Ahmed", role: "Operation Manager" }, { name: "Hussien Karem", image: "Hussien_Karem", role: "HR Manager" }, { name: "Ahmed Arafat", image: "Ahmed_Arafat", role: "IT Manager" }, { name: "Ahmed Talaa", image: "Ahmed_Talaat", role: "Customer Success Manager" }, { name: "Mennatullah Esmail", image: "Mennatullah_Esmail", role: "Reservation Manager" }, { name: "Nada Abdelazim", image: "NadaAbdelazim", role: "Sales Manager" }, { name: "Hagar Hassan", image: "HagarHassan", role: "Vice Tour Operators' Manager" }, { name: "Alaa Ali", image: "Adly_Ebrahim", role: "Transportation Manager" },]
</script>

<style scoped lang="scss">
.messageReduis {
  border-radius: 2px 40px 40px 40px;
}
</style>
