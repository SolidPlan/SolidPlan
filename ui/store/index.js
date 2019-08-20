export const actions = {
  async init ({ dispatch }) {
    await Promise.all([
      dispatch('projects/init'),
      dispatch('tasks/init'),
      dispatch('labels/init'),
      dispatch('users/init')
    ])
  },

  async reset ({ dispatch }) {
    await Promise.all([
      dispatch('projects/reset'),
      dispatch('tasks/reset'),
      dispatch('labels/reset'),
      dispatch('users/reset')
    ])
  }
}
