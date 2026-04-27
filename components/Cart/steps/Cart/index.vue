<template>
  <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

  <div class="grid xl:mx-20 mx-4 grid-cols-3 gap-6 my-8">
    <div class="  lg:col-span-2 col-span-3 flex flex-col gap-6">
      <div class="flex justify-between items-center ">
        <p class="text-xl font-medium">{{ $t('labels.trips.tours') }}</p>

        <UIButton :text="$t(`labels.trips.clearAll`)" :disabled="cartData.length == 0" :classes="[
          'border tranistion duration-300 border-primary border-[1px] hover:bg-primary font-meduim hover:text-white !px-4',
        ]" preIcon="close-circle" :preIconClasses="[
          'text-xl  tranistion duration-300 !opacity-100 !text-primary group-hover:!text-white w-5 h-5',
        ]" @click="clearCart" />
      </div>


      <div class="flex flex-col gap-6" v-if="!isLoading && cartData.length > 0">
        <template v-for="(item, index) in cartData" :key="index">
          <CartStepsCartCard v-if="item.type == 'tour'" @updateCart="getCartData"
            @updateTotal="assignSumTotal($event, index)" :tour="item" />

          <CartStepsCartRentCard v-if="item.type == 'rental'" :tour="item" @updateTotal="assignSumTotal($event, index)"
            @updateCart="getCartData" />
        </template>
      </div>

      <div v-if="isLoading" class="bg-white w-full h-96 rounded-3xl flex items-center justify-center">
        <UILoadingData />
      </div>

      <div v-if="!isLoading && cartData.length == 0" class=" w-full h-96 rounded-3xl flex items-center justify-center">
        <p class=" text-2xl font-medium">Your cart is currently empty :(
        </p>
      </div>
    </div>

    <div class="lg:col-span-1 col-span-3 max-h-fit sticky top-36 rounded-3xl py-6 px-8 bg-white ">
      <h6 class="text-2xl pb-6 borderDashed text-textLight font-medium">{{
        $t("labels.checkout.sumarry") }}
      </h6>

      <div class="py-6 borderDashed">

        <div class="flex justify-between items-center mb-4">
          <p class="text-textLight text-sm font-medium">{{ $t("labels.checkout.totalNums") }}
          </p>

          <p class="text-xl font-medium">{{ cartData.length }}</p>
        </div>
        <div class="flex justify-between items-center mb-4">
          <p class="text-textLight text-sm font-medium">{{ $t("labels.checkout.subTotal") }}
          </p>

          <p class="text-xl font-medium">{{ selectedCurrancies.symbol }}{{ (subTotal).toFixed(2) }}</p>
        </div>
        <div class="flex justify-between items-center mb-4">
          <p class="text-textLight text-sm font-medium">{{ $t("labels.checkout.adds") }}
          </p>

          <p class="text-xl font-medium">{{ selectedCurrancies.symbol }}{{ (addonsTotal).toFixed(2) }}</p>
        </div>
        <div v-if="couponData" class="flex justify-between items-center mb-4">
          <p class="text-textLight text-sm font-medium">{{ $t("labels.checkout.discount") }}
          </p>

          <p class="text-xl text-[#F55157] font-medium">-{{ selectedCurrancies.symbol }}{{ ((total * couponData.value
            / 100)
            *
            selectedCurrancies.exchange_rate).toFixed(2) }}</p>
        </div>
      </div>

      <div class="py-6 borderDashed">
        <p class="font-medium mb-3">{{ $t("labels.checkout.discountCoupon") }}</p>

        <VeeForm :validation-schema="schema" :initial-values="initialValues" v-slot="{ values, errors }"
          @submit="submit">
          <div class="flex gap-2">
            <UIText name="code" :placeholder="$t('labels.checkout.addCouponCode')" />

            <UIButton :disabled="!cartData.length" :text="$t(`inputLabels.apply`)" type="submit" :classes="[
              'border !rounded-xl !font-medium !py- !px-8 border-primary border-[1px] min-w-fit hover:bg-primary font-meduim hover:text-white !px-4',
            ]" />
          </div>
        </VeeForm>
      </div>

      <div class="flex justify-between items-center my-6">
        <p class="font-medium text-xl">{{ $t('labels.checkout.grandTotal') }}</p>

        <p class="text-[30px] text-primary font-medium">{{ selectedCurrancies.symbol }}{{ ((couponData ?
          totalWithDiscount
          : total)).toFixed(2) }}</p>
      </div>

      <div class="flex items-center gap-1">
        <div class="cntr flex gap-2 items-end group w-fit">
          <input v-bind="field" v-model="agreeTerms" type="checkbox" id="cbx" class="hidden-xs-up" />
          <label for="cbx" class="cbx group-hover:border-[#c57007] checked: transition-colors"></label>
          <label for="cbx" class="font-medium cursor-pointer group-hover:text-[#c57007] transition-colors">{{
            $t("labels.auth.signup.iAgree") }}</label>
        </div>

        <NuxtLink class="text-primary font-medium underline" :to="localePath('terms-and-conditions')">{{
          $t("labels.auth.signup.termsAndConditions")
        }}</NuxtLink>

        <p class="text-sm text-red-500 ms-auto">Check here first</p>
      </div>

      <div class="my-6 hidden lg:block">
        <UIButton type="button" :disabled="!agreeTerms || cartData.length == 0" @click="checkout"
          :classes="['w-full !py-4 hover:bg-[#143485]  font-medium text-white bg-primary !justify-center']"
          :text="$t('labels.checkout.checkoutNow')" />
      </div>
      <div class="lg:relative p-4 bg-white submitBoxShadow  fixed bottom-0 left-0 lg:hidden   flex justify-end w-full">
        <UIButton type="button" :disabled="!agreeTerms || cartData.length == 0" @click="checkout"
          :classes="['w-full !py-4 hover:bg-[#143485]  font-medium text-white bg-primary !justify-center']"
          :text="$t('labels.checkout.checkoutNow')" />
      </div>

    </div>
  </div>
</template>

<script setup lang='js'>
import { configure } from "vee-validate";
import * as yup from "yup";
import { sharedStore } from '~/stores/sharedStore.js'
import { storeToRefs } from 'pinia'

const router = useRouter()
const localePath = useLocalePath()
const emits = defineEmits(['updateStep'])
const { selectedCurrancies } = storeToRefs(sharedStore())
const { t } = useI18n()


const { getData, deleteData } = useApi()
const toast = useNuxtApp().$toast
const isLoading = ref(true)
const SumTotals = ref({})

const assignSumTotal = (total, index) => {
  SumTotals.value[index] = total
}

const total = computed(() => {
  let total = 0
  const keys = Object.keys(SumTotals.value)
  if (keys.length == 0) return 0
  keys.forEach((key) => {
    total += SumTotals.value[key].total
  })

  return total
})

const totalWithDiscount = computed(() => {
  if (couponData.value) {
    return total.value - (total.value * couponData.value.value / 100)
  } else {
    return total.value
  }
})
const subTotal = computed(() => {
  let total = 0
  const keys = Object.keys(SumTotals.value)
  if (keys.length == 0) return 0
  keys.forEach((key) => {
    total += SumTotals.value[key].subTotal
  })
  return total
})
const addonsTotal = computed(() => {
  let total = 0
  const keys = Object.keys(SumTotals.value)
  if (keys.length == 0) return 0
  keys.forEach((key) => {
    total += SumTotals.value[key].addons
  })
  return total
})



configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  validateOnInput: true,
});


const agreeTerms = ref(false);
const schema = yup.object().shape({
  code: yup.string(),
});
const breadcrumbItems = [{ title: "home", disabled: false, path: "/" }, { title: "cart", disabled: true, path: "" },]

const couponData = ref(null)

const submit = (values) => {
  const token = useCookie('sunpyramids-token').value
  if (!token) {
    toast.error('Please login to apply the coupon')
  } else {
    getData(`/coupons/${values.code}/validate`, {}, true).then((res) => {
      toast.success(res.message)
      couponData.value = res.data
    }).catch((err) => {
      toast.error(err.data.message)
    })
  }
}

const checkout = () => {
  router.push(localePath("/cart/checkout"));
  useCookie('sunpyramids-checkout-data').value = JSON.stringify({
    toursNumber: cartData.value.length,
    total: total.value / selectedCurrancies.value.exchange_rate,
    totalWithDiscount: totalWithDiscount.value / selectedCurrancies.value.exchange_rate,
    subTotal: subTotal.value / selectedCurrancies.value.exchange_rate,
    addonsTotal: addonsTotal.value / selectedCurrancies.value.exchange_rate,
    discountValue: couponData.value ? couponData.value.value : null,
    discountID: couponData.value ? couponData.value.id : null,
  })
}

const cartData = ref([])

const getCartData = async () => {
  isLoading.value = true
  cartData.value = []
  const isToken = useCookie('sunpyramids-token').value ? true : false
  await getData('cart/list', {}, isToken).then((res) => {
    cartData.value = res.data
    isLoading.value = false
  })
}

setTimeout(() => {
  getCartData()
}, 300);

const clearCart = async () => {
  await deleteData('cart/clear').then((res) => {
    if (res.status) {
      toast.success(res.message)
      cartData.value = []
    }
  })
}

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

.cbx {
  position: relative;
  top: 1px;
  width: 24px;
  height: 24px;
  border: 2px solid #a5a5a5;
  border-radius: 5px;
  vertical-align: middle;
  cursor: pointer;
  display: block;
}

.cbx:hover {
  border-color: #c57007;
}

.cbx:after {
  content: "";
  position: absolute;
  top: 2px;
  left: 7px;
  width: 6px;
  height: 12px;
  opacity: 0;
  transform: rotate(45deg) scale(0);
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}

.lbl {
  margin-left: 5px;
  vertical-align: middle;
  cursor: pointer;
}

#cbx:checked~.cbx {
  border-color: transparent;
  background: #f7951d;

  &:hover {
    background-color: #c57007;
    transition: all 0.1s ease;
  }

  @apply group-hover:bg-[#c57007];
}

#cbx:checked~.cbx:after {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.cntr {
  position: relative;
}

.hidden-xs-up {
  display: none !important;
}
</style>