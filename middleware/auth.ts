import { defineNuxtRouteMiddleware, navigateTo, useSupabaseUser } from '#imports';

export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser();
  if (!user.value) {
    return navigateTo('/');
  }
});
