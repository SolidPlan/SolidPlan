export default async (context) => {
  if (context.$auth.$state.loggedIn) {
    await context.store.dispatch('init', context)
  } else {
    await context.store.dispatch('initTheme', context)
  }
}
