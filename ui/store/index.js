export const actions = {
  async init ({ dispatch }) {
    await Promise.all([dispatch('projects/init'), dispatch('tasks/init')])
  },

  async reset ({ dispatch }) {
    await Promise.all([dispatch('projects/reset'), dispatch('tasks/reset')])
  }
}
