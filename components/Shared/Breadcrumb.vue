<template>
  <section class="bg-[#f9fafb] px-4 xl:px-20 py-2">
    <ul class="hidden  lg:flex items-center gap-1">
      <li v-for="(item, index) in props.items" class="flex items-center gap-1 font-normal" :class="[
          index + 1 != props.items.length ? 'text-textLight' : 'text-textDark',
        ]">
        <NuxtLink :to="localePath(item.path)" v-if="!item.disabled">
          {{ item.directTitle ? item.title : $t("labels." + item.title) }}
        </NuxtLink>

        <p v-else>
          {{ item.directTitle ? item.title : $t("labels." + item.title) }}
        </p>

        <NuxtImg v-if="index + 1 != props.items.length" src="/icons/arrow-right.png" class="w-5 h-5" />
      </li>
    </ul>

    <div class="flex lg:hidden items-center gap-4">
      <NuxtImg @click="router.go(-1)" src="/icons/arrow-left.png"
        class="p-3 min-w-[18px] min-h-[18px] hover:bg-dark transition-colors rounded-full border cursor-pointer" />

      <h5 class="font-normal truncate">{{ props.mobItem.directTitle ? props.mobItem.title : $t("labels." +
        props.mobItem.title) }}</h5>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: "",
  },
  mobItem: {
    type: Object,
    required: true,
    default: "",
  },
});

const localePath = useLocalePath();
const router = useRouter()
</script>

<style scoped lang="scss"></style>
