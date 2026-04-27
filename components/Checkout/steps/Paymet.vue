<template>
  <div class="grid grid-cols-3 gap-6 mt-6">
    <div class="lg:col-span-2 col-span-3 flex flex-col gap-6">
      <div class="lg:p-10 p-4 py-6 bg-white lg:rounded-2xl w-full">

        <div class="rounded-2xl mb-6" :class="[SelectedOption == 'card' ? 'bg-[#f9fafb]' : '']">
          <label class="radio-button border p-3 border-[#EEEEEE] rounded-2xl flex items-center gap-2 justify-between"
            :class="[SelectedOption == 'card' ? 'bg-[#e9eefc]' : '']">
            <div class="min-w-fit flex items-center"> <input v-model="SelectedOption" value="card" type="radio" />
              <span class="radio-checkmark"></span>
            </div>

            <div class="w-full flex justify-between items-center">
              <p :class="[SelectedOption == 'card' ? 'text-primary' : '']">Debit /Credit Card</p>

              <div class="flex gap-3 items-center">
                <span class=" flex justify-center items-center rounded-[10px] py-[14px] px-3  bg-[#f9fafb]">
                  <img src="../../../assets/icons/visa.png" alt="">
                </span>

                <span class="p-1 flex justify-center items-center rounded-[10px] bg-[#f9fafb]">
                  <img src="../../../assets/icons/mastercard.png" alt="">
                </span>
              </div>
            </div>
          </label>
        </div>

        <label class="radio-button border p-3 border-[#EEEEEE] rounded-2xl flex items-center gap-2 justify-between"
          :class="[SelectedOption == 'paypal' ? 'bg-[#e9eefc]' : '']">
          <div class="min-w-fit flex items-center"> <input v-model="SelectedOption" value="paypal" type="radio" />
            <span class="radio-checkmark"></span>
          </div>

          <div class="w-full flex justify-between items-center">
            <p :class="[SelectedOption == 'paypal' ? 'text-primary' : '']">PayPal</p>

            <div class="flex gap-3 items-center">
              <span class="p-1 flex justify-center items-center rounded-[10px] bg-[#f9fafb]">
                <img src="../../../assets/icons/paypal.png" alt="">
              </span>
            </div>
          </div>
        </label>

        <div class="col-span-2 lg:flex hidden mt-12  justify-between w-full gap-8">
          <UIButton @click="router.push(localePath('/'))" type="button" :classes="[
            'py-4 !px-[4.5rem] font-medium border !min-w-fit me-2  gap-2 border-[1px] text-textDark   font-meduim hover:text-white border-textLight hover:bg-textDark',
          ]" :text="$t('labels.back')" />
          <UIButton :loading="isLoading" @click="submit" :classes="[
            'py-4 !px-[4.5rem] min-w-fit gap-2 border bg-[#00af6c] border-[#00af6c] border-[1px] text-base font-medium hover:bg-[#14523a] text-white font-meduim hover:text-white',
          ]" :text="$t('labels.checkout.payNow')" />
        </div>
        <div
          class="lg:relative p-4 bg-white submitBoxShadow  fixed bottom-0 left-0 lg:hidden   flex justify-end w-full gap-4">
          <UIButton @click="router.push(localePath('/'))" type="button" :classes="[
            'py-4 !px-[4.5rem] w-full !justify-center font-medium border !min-w-fit me-2  gap-2 border-[1px] text-textDark   font-meduim hover:text-white border-textLight hover:bg-textDark',
          ]" :text="$t('labels.back')" />
          <UIButton :loading="isLoading" @click="submit" :classes="[
            'py-4 !px-[4.5rem] min-w-fit w-full !justify-center gap-2 border bg-[#00af6c] border-[#00af6c] border-[1px] text-base font-medium hover:bg-[#14523a] text-white font-meduim hover:text-white',
          ]" :text="$t('labels.checkout.payNow')" />
        </div>
      </div>
    </div>

    <CheckoutSummary />
  </div>
</template>

<script setup lang='js'>
const router = useRouter();
const localePath = useLocalePath();
const emits = defineEmits(["getPayment"])

const isLoading = ref(false)


const SelectedOption = ref('card')

const submit = () => {
  isLoading.value = true
  emits("getPayment", SelectedOption.value)
}
</script>

<style scoped lang='scss'>
.radio-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.075s ease-in-out;
}

.radio-button input[type="radio"] {
  display: none;
}

.radio-checkmark {
  display: inline-block;
  position: relative;
  min-width: 24px;
  min-height: 24px;
  border: 2px solid;
  border-radius: 50%;
  @apply border-[#A5A5A5];
}

.radio-checkmark:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  min-width: 16px;
  min-height: 16px;
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
  @apply bg-primary;
}

.radio-button input[type="radio"]:checked~.radio-checkmark:before {
  transform: translate(-50%, -50%) scale(1);
}

.radio-button input[type="radio"]:checked~.radio-checkmark {
  @apply border-primary;
}
</style>