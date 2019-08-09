import { findIndex } from 'lodash'

export const state = () => ({
  list: []
})

export const mutations = {
  set (state, projects) {
    state.list = projects
  },
  add (state, project) {
    state.list.push(project)
  },
  remove (state, project) {
    const id = project.id
    state.list.splice(findIndex(state.list, { id }), 1)
  }
}

export const actions = {
  async load ({ state, commit }) {
    if (state.list.length === 0) {
      const data = await this.$axios.$get('/api/projects')
      commit('set', data['hydra:member'])
    }
  },

  async add ({ commit }, name) {
    const data = await this.$axios.$post('/api/projects', { name })

    commit('add', data)
  },

  async remove ({ commit }, project) {
    await this.$axios.$delete(`/api/projects/${project.id}`)

    commit('remove', project)
  }
}
