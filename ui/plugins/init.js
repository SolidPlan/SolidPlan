export default async (context) => {
  if (context.$auth.$state.loggedIn) {
    await context.store.dispatch('init', context)
  }
}
