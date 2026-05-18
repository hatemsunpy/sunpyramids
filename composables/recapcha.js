export async function generateRecaptchaToken(siteKey, action = "submit") {
  return new Promise((resolve, reject) => {
    grecaptcha.enterprise.ready(async () => {
      try {
        const token = await grecaptcha.enterprise.execute(siteKey, { action });
        resolve(token);
      } catch (error) {
        console.error("reCAPTCHA error:", error);
        reject(error);
      }
    });
  });
}
