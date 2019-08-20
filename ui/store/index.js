export const state = () => ({
  showLabels: JSON.parse(localStorage.getItem('showLabels') || true)
})

export const mutations = {
  toggleLabels (state, value) {
    state.showLabels = value
  }
}

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
  },

  toggleLabels ({ commit, state }) {
    localStorage.setItem('showLabels', JSON.stringify(!state.showLabels))
    commit('toggleLabels', !state.showLabels)
  }
}
