import { findIndex, forEach } from 'lodash'

export const state = () => ({
  list: []
})

export const mutations = {
  set (state, tasks) {
    state.list = tasks
  },

  reset (state) {
    state.list = []
  },

  add (state, task) {
    state.list.push(task)
  },

  remove (state, label) {
    state.list.splice(findIndex(state.list, { '@id': label['@id'] }), 1)
  },

  update (state, { label, data }) {
    forEach(data, (value, key) => {
      if (label[key] !== value) {
        label[key] = value
      }
    })
  }
}

export const actions = {
  async init ({ state, commit }) {
    if (state.list.length === 0) {
      const data = await this.$axios.$get('/api/labels')
      commit('set', data['hydra:member'])
    }
  },

  reset ({ commit }) {
    commit('reset')
  },

  async add ({ commit, dispatch }, label) {
    const data = await this.$axios.$post('/api/labels', label)

    commit('add', data)
  },

  async edit ({ commit, dispatch }, { label, name, color }) {
    const data = await this.$axios.$put(`/api/labels/${label.id}`, { name, color })

    commit('update', { label, data })
  },

  async remove ({ commit, dispatch }, label) {
    await this.$axios.$delete(`/api/labels/${label.id}`)

    commit('remove', label)
  }
}
