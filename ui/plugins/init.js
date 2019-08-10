export default async (ctx) => {
  await ctx.store.dispatch('init', ctx)
}
