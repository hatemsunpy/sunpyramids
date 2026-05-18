export default defineEventHandler(async (event) => {
  try {
    let request_url = getRequestURL(event);
    const originalUrl = request_url.href;
    
    const pathname = request_url.pathname;
    if (
      originalUrl.includes("__nuxt_error") ||
      pathname.startsWith("/_ipx") ||
      pathname.startsWith("/_nuxt") ||
      pathname.startsWith("/images") ||
      /\.[a-zA-Z0-9]+$/.test(pathname)
    ) {
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
