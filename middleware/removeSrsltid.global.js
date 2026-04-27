export default defineNuxtRouteMiddleware((to) => {
  // Check if the `srsltid` parameter exists in the query
  if (to.query.srsltid) {
    const { srsltid, ...restQuery } = to.query;

    // Redirect to the same path without the `srsltid` parameter
    return navigateTo(
      { path: to.path, query: restQuery },
      { redirectCode: 301 },
    );
  }
});
