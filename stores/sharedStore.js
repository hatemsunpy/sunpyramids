import { defineStore } from "pinia";
export let sharedStore = defineStore("sharedData", () => {
  const { getData } = useApi();
  const settings = ref([]);
  const nationalities = ref([]);
  const currancies = ref([]);
  const selectedCurrancies = ref(null);
  const carruncy = useCookie("carruncy").value ?? "USD";

  const getSettings = async () => {
    await getData("settings").then((res) => {
      settings.value = res.data;
    });
  };

  const getnationalities = async () => {
    await getData("countries").then((res) => {
      nationalities.value = res.data;
    });
  };
  const getCurrancies = async () => {
    await getData("currencies").then((res) => {
      currancies.value = res.data.reverse();
      selectedCurrancies.value = currancies.value.find(
        (c) => c.name == carruncy
      );
    });
  };

  const updateCurrancies = (c) => {
    selectedCurrancies.value = c;
    useCookie("carruncy").value = c.name;
  };

  return {
    getSettings,
    settings,
    nationalities,
    getnationalities,
    getCurrancies,
    selectedCurrancies,
    updateCurrancies,
    currancies,
  };
});
