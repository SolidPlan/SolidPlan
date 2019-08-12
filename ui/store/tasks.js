import { filter, findIndex, forEach } from 'lodash'

export const state = () => ({
  list: []
})

export const mutations = {
  set (state, tasks) {
    state.list = tasks
  },

  add (state, task) {
    state.list.push(task)
  },

  remove (state, task) {
    state.list.splice(findIndex(state.list, { '@id': task['@id'] }), 1)
  },

  toggle (state, task) {
    task.status = task.status === 'open' ? 'closed' : 'open'
  },

  assignToProject (state, { task, project }) {
    if (project === null) {
      task.project = null
    } else {
      task.project = project['@id']
      project.tasks.push(task['@id'])
    }
  },

  update (state, { task, data }) {
    forEach(data, (value, key) => {
      if (task[key] !== value) {
        task[key] = value
      }
    })
  }
}

export const actions = {
  async init ({ state, commit }) {
    if (state.list.length === 0) {
      const data = await this.$axios.$get('/api/tasks')
      commit('set', data['hydra:member'])
    }
  },

  async add ({ commit, dispatch }, { project, task }) {
    const data = await this.$axios.$post(`/api/tasks`, { name: task, status: 'open', project: project ? project['@id'] : null })

    commit('add', data)

    if (project) {
      dispatch('projects/addTask', { project, task }, { root: true })
    }

    return data
  },

  async remove ({ commit, dispatch }, task) {
    await this.$axios.$delete(`/api/tasks/${task.id}`)

    if (task.project) {
      dispatch('projects/removeTask', { project: task.project, task }, { root: true })
    }

    commit('remove', task)
  },

  async toggle ({ commit }, task) {
    await this.$axios.$put(`/api/tasks/${task.id}`, { status: task.status === 'open' ? 'closed' : 'open' })
    commit('toggle', task)
  },

  markDone ({ dispatch }, task) {
    if (task.status === 'open') {
      dispatch('toggle', task)
    }
  },

  async edit ({ commit }, { task, data }) {
    const taskData = await this.$axios.$put(`/api/tasks/${task.id}`, data)

    commit('update', { task, data: taskData })
  },

  async assignToProject ({ commit }, { task, project }) {
    if (task.project !== (project ? project['@id'] : null)) {
      await this.$axios.$put(`/api/tasks/${task.id}`, { project: project ? project['@id'] : null })

      if (task.project) {
        await commit('projects/removeTask', { project: task.project, task }, { root: true })
      }

      commit('assignToProject', { task, project })
    }
  }
}

export const getters = {
  getTasksByProject: state => (project) => {
    return filter(state.list, project ? { 'project': project['@id'] } : null)
  }
}
