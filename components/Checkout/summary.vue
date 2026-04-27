<template>
  <div class="lg:col-span-1 col-span-3 lg:rounded-3xl py-6 px-8 bg-white max-h-fit">
    <h6 class="text-2xl pb-6 borderDashed text-textLight font-medium">{{
      $t("labels.checkout.sumarry") }}
    </h6>

    <div class="py-6 borderDashed">

      <div class="flex justify-between items-center mb-4">
        <p class="text-textLight text-sm font-medium">{{ $t("labels.checkout.totalNums") }}
        </p>

        <p class="text-xl font-medium">{{ data.toursNumber }}</p>
      </div>
      <div class="flex justify-between items-center mb-4">
        <p class="text-textLight text-sm font-medium">{{ $t("labels.checkout.subTotal") }}
        </p>

        <p class="text-xl font-medium">{{ selectedCurrancies.symbol }}{{ ((data.subTotal) *
          selectedCurrancies.exchange_rate).toFixed(2) }}</p>
      </div>
      <div class="flex justify-between items-center mb-4">
        <p class="text-textLight text-sm font-medium">{{ $t("labels.checkout.adds") }}
        </p>

        <p class="text-xl font-medium">{{ selectedCurrancies.symbol }}{{ ((data.addonsTotal) *
          selectedCurrancies.exchange_rate).toFixed(2) }}</p>
      </div>

      <div v-if="data.discountValue" class="flex justify-between items-center mb-4">
        <p class="text-textLight text-sm font-medium">{{ $t("labels.checkout.discount") }}
        </p>

        <p class="text-xl text-[#F55157] font-medium">-{{ selectedCurrancies.symbol }}{{ ((data.total *
          data.discountValue / 100) *
          selectedCurrancies.exchange_rate).toFixed(2) }}</p>
      </div>
    </div>

    <div class="flex justify-between items-center my-6">
      <p class="font-medium text-xl">{{ $t('labels.checkout.grandTotal') }}</p>

      <p class="text-[30px] text-primary font-medium">{{ selectedCurrancies.symbol }}{{ ((data.discountValue ?
        data.totalWithDiscount : data.total) *
        selectedCurrancies.exchange_rate).toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup lang='js'>
import { sharedStore } from '~/stores/sharedStore.js'
import { storeToRefs } from 'pinia'

const { selectedCurrancies } = storeToRefs(sharedStore())
const data = useCookie('sunpyramids-checkout-data').value || '{}'

</script>

<style scoped lang='scss'>
.borderDashed {
  border-bottom: 2px solid #EEEEEE;
  border-image: repeating-linear-gradient(90deg,
      #EEEEEE 0px,
      #EEEEEE 10px,
      /* Dash size */
      transparent 15px,
      transparent 20px
      /* Space size */
    ) 10;
}
</style>