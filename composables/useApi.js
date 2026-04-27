export default function useApi() {
  const { locale } = useI18n();

  const config = useRuntimeConfig();
  const baseURL = config.public.baseURL;

  let options = {
    accept: "application/json",
    "Content-Type": "application/json",
    "X-Localize": locale.value,
  };

  const tokenAuth = () => {
    options["Authorization"] = `Bearer ${useCookie("sunpyramids-token").value}`;
  };

  // get data
async function getData(uri, params = {}, withToken = true) {
  try {
    if (withToken) {
      tokenAuth();
    }

    const { data, error } = await useFetch(uri, {
      method: "GET",
      baseURL,
      headers: options,
      params,
    });

    if (error.value) {
      throw error.value;
    }

    return data.value;
  } catch (err) {
    throw err;
  }
}

  // post data
  async function postData(uri, body, withToken = true, isFormData = false) {
    try {
      if (withToken) {
        tokenAuth();
      }

      if (isFormData) {
        delete options["Content-Type"];
      }

      let data = await $fetch(`${uri}`, {
        method: "POST",
        baseURL: baseURL,
        headers: options,
        body,
      });
      return data;
    } catch (err) {
      throw err;
    }
  }
  // delete data
  async function deleteData(uri, withToken = true) {
    try {
      if (withToken) {
        tokenAuth();
      }

      let data = await $fetch(`${uri}`, {
        method: "DELETE",
        baseURL: baseURL,
        headers: options,
      });
      return data;
    } catch (err) {
      throw err;
    }
  }
  async function putData(uri, withToken = true) {
    try {
      if (withToken) {
        tokenAuth();
      }

      let data = await $fetch(`${uri}`, {
        method: "PUT",
        baseURL: baseURL,
        headers: options,
      });
      return data;
    } catch (err) {
      throw err;
    }
  }
  async function patchData(uri, body, withToken = true) {
    try {
      if (withToken) {
        tokenAuth();
      }

      let data = await $fetch(`${uri}`, {
        method: "PATCH",
        baseURL: baseURL,
        headers: options,
        body,
      });
      return data;
    } catch (err) {
      throw err;
    }
  }

  return { getData, postData, deleteData, putData, patchData };
}
