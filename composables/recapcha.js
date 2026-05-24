export async function generateRecaptchaToken(siteKey, action = "submit") {
  const { $ensureRecaptchaLoaded, $toast } = useNuxtApp()
  try {
    await $ensureRecaptchaLoaded()
  } catch {
    $toast?.error("Security verification unavailable, please try again.")
    throw new Error("reCAPTCHA load failed")
  }
  return new Promise((resolve, reject) => {
    grecaptcha.enterprise.ready(async () => {
      try {
        const token = await grecaptcha.enterprise.execute(siteKey, { action });
        resolve(token);
      } catch (error) {
        console.error("reCAPTCHA error:", error);
        $toast?.error("Security verification failed. Please try again.")
        reject(error);
      }
    });
  });
}
