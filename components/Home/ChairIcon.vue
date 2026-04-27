<template>
  <div class="md:block hidden fixed md:bottom-[150px] bottom-28 md:end-20 end-6 z-40 group">

    <div
      class="md:w-[62px] md:h-[62px] w-14 h-14 rounded-full bubble-btn bg-primary flex items-center justify-center   group-hover:-rotate-[20deg] transition-transform duration-300">

      <NuxtImg src="/icons/chair.svg" alt="chair icon" class="icon-white md:w-[42px] md:h-[42px] w-10 h-10" />
    </div>

    <div class="popup border lg:w-[800px] md:w-[500px] w-[300px]">
      <p class="text-xl font-medium text-center">
        {{ $t('labels.specialNeed.popup') }}</p>


      <UIButton @click="router.push(localePath('/accessible-travel'))" type="button" :loading="isLoading" :classes="[
        'py-3 !px-12 min-w-fit gap-2  !justify-center bg-secondary  text-base font-medium hover:bg-[#c57007] mt-5 mx-auto text-white font-meduim hover:text-white',
      ]" :text="$t('labels.specialNeed.reedMore')" />
    </div>
  </div>


  <div class="md:hidden block fixed md:bottom-[150px] bottom-28 md:end-20 end-6 z-40 group" @mouseover="isOpen = true"
    @mouseleave="closePopup">

    <div
      class="md:w-[62px] md:h-[62px] w-14 h-14 rounded-full bubble-btn bg-primary flex items-center justify-center   group-hover:-rotate-[20deg] transition-transform duration-300">

      <NuxtImg src="/icons/chair.svg" alt="chair icon" class="icon-white md:w-[42px] md:h-[42px] w-10 h-10" />
    </div>

    <div v-if="isOpen" class="popup border lg:w-[800px] md:w-[500px] w-[300px]">
      <p class="text-xl font-medium text-center">
        {{ $t('labels.specialNeed.popup') }}</p>


      <UIButton @click="router.push(localePath('/accessible-travel')), closePopup()" type="button" :loading="isLoading"
        :classes="[
          'py-3 !px-12 min-w-fit gap-2  !justify-center bg-secondary  text-base font-medium hover:bg-[#c57007] mt-5 mx-auto text-white font-meduim hover:text-white',
        ]" :text="$t('labels.specialNeed.reedMore')" />
    </div>

  </div>
</template>

<script setup lang="js">
const router = useRouter();
const localePath = useLocalePath();
const isOpen = ref(false);


const closePopup = () => {
  setTimeout(() => {
    isOpen.value = false;
  }, 300);
}

</script>

<style scoped>
.icon-white {
  filter: brightness(0) invert(1);
}

.bubble-btn {
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.25),
    inset 0 4px 8px rgba(255, 255, 255, 0.25),
    inset 0 -4px 8px rgba(0, 0, 0, 0.2);
}

.popup {
  position: absolute;
  bottom: calc(100% + 12px);
  right: 0;

  padding: 16px;
  border-radius: 14px;

  background: rgba(255, 255, 255, 1);
  backdrop-filter: blur(10px);

  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.15);

  opacity: 0;
  transform: translateY(10px) scale(0.95);
  visibility: hidden;

  transition:
    opacity 0.25s ease 0.1s,
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1) 0.1s,
    visibility 0s linear 0.25s;
}

.group:hover .popup {
  opacity: 1;
  transform: translateY(0) scale(1);
  visibility: visible;
}

.popup::after {
  content: "";
  position: absolute;
  bottom: -6px;
  right: 22px;
  z-index: -2;

  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.85);
  transform: rotate(45deg);

  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.05);
}
</style>