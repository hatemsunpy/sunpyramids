import { defineStore } from "pinia";
export let userStore = defineStore("userData", () => {
  let userData = ref({});

  function getUserData(value) {
    userData.value = value;
  }

  return { userData, getUserData };
});
