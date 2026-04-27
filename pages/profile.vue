<template>
  <SharedBreadcrumb :items="breadcrumbItems" :mobItem="breadcrumbItems[breadcrumbItems.length - 1]" />

  <div class="2xl:px-[10.75rem] xl:px-[5.75rem] lg:px-20 px-4 py-[2.375rem] flex gap-5">
    <div class="bg-white lg:block hidden p-4 rounded-3xl min-w-[305px] max-h-fit sticky top-36">
      <NuxtLink v-for="link in links" :key="link.name" :to="localePath(link.path)"
        class="flex items-center gap-2 mb-4 px-4 py-2 rounded-2xl transition-all"
        :class="[localePath(link.path) == route.fullPath ? 'text-white bg-textDark' : '']">
        <NuxtIcon :name="link.icon" class="text-xl w-5 h-5 text-primary"
          :class="[localePath(link.path) == route.fullPath ? 'text-white' : '']" />
        <span class="text-base font-medium">{{ $t(`labels.${link.name}`) }}</span>
      </NuxtLink>


      <hr class="mb-4">

      <div>
        <button @click="logOut" class="flex items-center gap-2 mb-4 px-4 py-2">
          <NuxtIcon name="logout" class="text-xl w-5 h-5 text-[#F55157]" />

          <span class="text-base font-medium">Logout</span>
        </button>
      </div>
    </div>


    <NuxtPage />
  </div>
</template>

<script setup lang='js'>
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()


const links = [{ path: '/profile/bookings', name: 'myBookings', icon: 'airplane' }, { path: '/profile/favourites', name: 'myFavorites', icon: 'heart-nonfill' }, { path: '/profile/settings', name: 'myProfile', icon: 'setting' },]

const currentPage = computed(() => {
  return links.find(link => localePath(link.path) === route.path)
})

const breadcrumbItems = computed(() => {
  return [{ title: "home", disabled: false, path: "/" }, { title: currentPage.value.name, disabled: true, path: "" },]
})

const logOut = () => {
  useCookie('sunpyramids-user').value = null
  useCookie('sunpyramids-token').value = null

  router.push(localePath('/'))
}

</script>

<style scoped lang='scss'></style>