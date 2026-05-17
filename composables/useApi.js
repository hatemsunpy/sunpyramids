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
async function getData(uri, params = {}, withToken = true, pickFields = null) {
  try {
    if (withToken) {
      tokenAuth();
    }

    const fetchOptions = {
      method: "GET",
      baseURL,
      headers: options,
      params,
    }

    // Support picking specific fields from response data to reduce hydration payload
    if (pickFields && Array.isArray(pickFields)) {
      fetchOptions.transform = (response) => {
        if (!response || !response.data) return response
        const picked = {}
        pickFields.forEach((field) => {
          if (response.data[field] !== undefined) {
            picked[field] = response.data[field]
          }
        })
        return { ...response, data: picked }
      }
    }

    const { data, error } = await useFetch(uri, fetchOptions)

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
