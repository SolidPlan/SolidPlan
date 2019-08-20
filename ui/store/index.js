export const state = () => ({
  showLabels: JSON.parse(localStorage.getItem('showLabels') || true),
  theme: JSON.parse(localStorage.getItem('theme') || false)
})

export const mutations = {
  toggleLabels (state, value) {
    state.showLabels = value
  },
  toggleTheme (state, value) {
    state.theme = value
  }
}

export const actions = {
  async init ({ commit, dispatch, state }, context) {
    localStorage.setItem('showLabels', JSON.stringify(!state.showLabels))
    context.$vuetify.theme.dark = state.theme
    commit('toggleTheme', state.theme)

    await Promise.all([
      dispatch('projects/init', context),
      dispatch('tasks/init', context),
      dispatch('labels/init', context),
      dispatch('users/init', context)
    ])
  },

  async reset ({ dispatch }, context) {
    await Promise.all([
      dispatch('projects/reset', context),
      dispatch('tasks/reset', context),
      dispatch('labels/reset', context),
      dispatch('users/reset', context)
    ])
  },

  async toggleLabels ({ commit, state }) {
    await localStorage.setItem('showLabels', JSON.stringify(!state.showLabels))
    commit('toggleLabels', !state.showLabels)
  },

  async toggleTheme ({ commit, state }, context) {
    context.$vuetify.theme.dark = !state.theme
    await localStorage.setItem('theme', JSON.stringify(!state.theme))
    commit('toggleTheme', !state.theme)
  }
}
