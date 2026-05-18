<template>
  <div class="border rounded-full relative p-[6px] flex items-center gap-5 cursor-pointer"
    @click.self="isShowModel = !isShowModel" @click="">
    <div @click="isShowModel = !isShowModel" class="flex items-center gap-[6px]">
      <img src="../../assets/icons/user.svg" width="28" height="28" class="text-primary" />

      <p>{{ user?.name?.split(' ')?.[0] ?? '' }}</p>
    </div>

    <NuxtImg @click="isShowModel = !isShowModel" class="w-5 opacity-50" src="/icons/arrow-down.svg" alt="logo" />


    <ul @click="emit('closeModel')" v-if="isShowModel"
      class="absolute  lg:-left-10 z-20 -left-28 border bg-white dropDownShadow rounded-2xl px-4 py-2 w-56 transition-all duration-200"
      style="top: calc(100% + 1rem)">
      <li @click="router.push(localePath('/profile/bookings'))"
        class="lg:flex hover:text-primary group/link hover:bg-third hidden justify-between transition px-4 py-2 rounded-lg">
        <span class="font-medium">Profile</span>

        <NuxtImg class="w-5 opacity-0 group-hover/link:opacity-100 transition-opacity" src="/icons/arrow-right.svg"
          alt="logo" />
      </li>

      <li @click="router.push(localePath('/profile/bookings'))"
        class="lg:hidden hover:text-primary group/link hover:bg-third flex justify-between transition px-4 py-2 rounded-lg">
        <span class="font-medium">{{ $t('labels.myBookings') }}</span>

        <NuxtImg class="w-5 opacity-0 group-hover/link:opacity-100 transition-opacity" src="/icons/arrow-right.svg"
          alt="logo" />
      </li>

      <div class=" h-[2px] bg-[#F9FAFB] my-1"></div>
      <li @click="router.push(localePath('/profile/favourites'))"
        class="lg:hidden hover:text-primary group/link hover:bg-third flex justify-between transition px-4 py-2 rounded-lg">
        <span class="font-medium">{{ $t('labels.myFavorites') }}</span>

        <NuxtImg class="w-5 opacity-0 group-hover/link:opacity-100 transition-opacity" src="/icons/arrow-right.svg"
          alt="logo" />
      </li>

      <div class="lg:hidden h-[2px] bg-[#F9FAFB] my-1"></div>
      <li @click="router.push(localePath('/profile/settings'))"
        class="lg:hidden hover:text-primary group/link hover:bg-third flex justify-between transition px-4 py-2 rounded-lg">
        <span class="font-medium">{{ $t('labels.myProfile') }}</span>

        <NuxtImg class="w-5 opacity-0 group-hover/link:opacity-100 transition-opacity" src="/icons/arrow-right.svg"
          alt="logo" />
      </li>

      <div class="lg:hidden h-[2px] bg-[#F9FAFB] my-1"></div>

      <li @click="logOut"
        class="hover:text-primary group/link hover:bg-third flex justify-between transition px-4 py-2 rounded-lg">
        <span class="font-medium">Log Out</span>

        <NuxtImg class="w-5 opacity-0 group-hover/link:opacity-100 transition-opacity" src="/icons/arrow-right.svg"
          alt="logo" />
      </li>
    </ul>
  </div>
</template>

<script setup lang='js'>
const user = useCookie('sunpyramids-user')
const isShowModel = ref(false)

const router = useRouter()
const localePath = useLocalePath()

const emits = defineEmits(["closeModel"])


const logOut = () => {
  useCookie('sunpyramids-user').value = null
  useCookie('sunpyramids-token').value = null
  emits("closeModel")
  router.push(localePath('/'))
}
</script>

<style scoped lang='scss'></style>