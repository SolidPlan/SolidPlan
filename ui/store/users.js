export const state = () => ({
  list: []
})

export const mutations = {
  set (state, tasks) {
    state.list = tasks
  },

  reset (state) {
    state.list = []
  }
}

export const actions = {
  async init ({ state, commit }) {
    if (state.list.length === 0) {
      const data = await this.$axios.$get('/api/users')
      commit('set', data['hydra:member'])
    }
  },

  reset ({ commit }) {
    commit('reset')
  }
}
