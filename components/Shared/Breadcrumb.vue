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

        <img v-if="index + 1 != props.items.length" src="/icons/arrow-right.png" class="w-5 h-5" />
      </li>
    </ul>

    <div class="flex lg:hidden items-center gap-4">
      <button type="button" @click="router.go(-1)" aria-label="Go back"
        class="p-3 flex items-center justify-center hover:bg-dark transition-colors rounded-full border">
        <img src="/icons/arrow-left.png" alt="" class="w-5 h-5" />
      </button>

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
