import { userStore } from "~/stores/userStore";

export default defineNuxtRouteMiddleware((to) => {
  let token = useCookie("sunpyramids-token").value;
  const { getUserData } = userStore();

  if (to.path == "/social-login") {
    useCookie("sunpyramids-token").value = to.query.token;
    useCookie("sunpyramids-user").value = JSON.parse(to.query.user);
    getUserData(JSON.parse(to.query.user));
    return navigateTo("/");
  }
  if (!token) {
    if (to.fullPath.includes("/profile")) {
      return navigateTo("/");
    }
  }
  if (to.fullPath == "/profile") {
    return navigateTo("/profile/bookings");
  }
});
