<template>
  <section
    class="py-[4.5rem] xl:px-20 px-4 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-8 xl:grid-rows-3 gap-x-8">
    <div
      class="col-span-1 xl:row-span-3 bg-[#F9FAFB] gap-6 p-8 rounded-[3rem] flex flex-col justify-center items-center">
      <span class="flex w-[5.5rem] h-[5.5rem] bg-white justify-center items-center rounded-[2rem]">
        <NuxtIcon name="location-filled" class="text-[2.5rem] text-primary" />
      </span>

      <h4 class="text-[2.125rem] font-medium">
        {{ $t("labels.contactus.info.adress.title") }}
      </h4>

      <p class="text-[#444444] leading-8 text-center text-xl">
        {{ $t("labels.contactus.info.adress.paragraph") }}
      </p>
    </div>

    <div class="col-span-1 xl:row-span-3 flex flex-col gap-7 h-full justify-between">
      <div v-for="(item, index) in phones" :key="index"
        class="flex  justify-between items-center px-6 py-5 bg-[#F9FAFB] rounded-[2rem]">
        <h6 class="text-xl text-[#444444]">{{ item }}</h6>

        <a :href="'tel:' + item">
          <UIButton :classes="[
            'bg-white w-14 h-14 rounded-full !gap-0 hover:bg-[#F9FAFB] transition !justify-center',
          ]" postIcon="call" :post-icon-classes="['text-2xl']" />
        </a>
      </div>
    </div>

    <div
      class="xl:col-span-1 md:col-span-2 col-span-1 xl:row-span-3  bg-[#F9FAFB] gap-3 p-8 rounded-[3rem] flex flex-col justify-center items-center">
      <span class="flex w-[5.5rem] h-[5.5rem] bg-white justify-center items-center rounded-[2rem]">
        <NuxtIcon name="sms" class="text-[2.5rem] text-primary" />
      </span>

      <h4 class="text-[2.125rem] font-medium">
        {{ $t("labels.contactus.info.email.title") }}
      </h4>

      <p v-for="item in settings.find((option) => option.option_key == 'notification_emails')?.option_value"
        class="text-[#444444] leading-8 text-center text-xl">
        {{ item }} </p>

      <p class="text-[#444444] leading-8 text-center text-xl">
        sustainability@sunpyramidstours.com </p>
    </div>
  </section>
</template>

<script setup lang="js">
import { storeToRefs } from 'pinia'
import { sharedStore } from '~/stores/sharedStore.js'

const { settings } = storeToRefs(sharedStore())
const phones = ['+20 109 588 8830', '+20 109 588 8831', '+20 109 588 8835']


</script>

<style scoped lang="scss"></style>
