export const actions = {
  async init ({ dispatch }) {
    await Promise.all([dispatch('projects/init'), dispatch('tasks/init')])
  }
}
