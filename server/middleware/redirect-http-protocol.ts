export default defineEventHandler(async (event) => {
  try {
    let request_url = getRequestURL(event);
    const originalUrl = request_url.href;
    
    if (originalUrl.includes("__nuxt_error")) {
      return; // Stop further processing
    }
    const hasUppercase = /[A-Z]/.test(originalUrl);

    if (request_url.origin.startsWith("https://www")) {
      await sendRedirect(
        event,
        request_url.href.toLowerCase().replace("https://www.", "https://"),
        301
      );
    } else if (hasUppercase) {
      await sendRedirect(event, request_url.href.toLowerCase(), 301);
    }
  } catch (e) {
    console.log("can not handel server redirect http protocol");
  }
});
