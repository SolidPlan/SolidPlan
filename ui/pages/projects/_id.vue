<template>
  <span>
    <v-toolbar class="mb-3 white--text" color="primary">
      <v-toolbar-title>{{ project.name }}</v-toolbar-title>
      <v-spacer />
      <template v-if="$vuetify.breakpoint.smAndUp">
        <v-btn icon color="white">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="white">
          <v-icon>mdi-delete-circle</v-icon>
        </v-btn>
      </template>
    </v-toolbar>
    <h4>Tasks</h4>
    <v-card>
      <create-task :project="project['@id']" @add="fetchTasks" />
    </v-card>
    <task-list :tasks="tasks" @refresh="fetchTasks" />
  </span>
</template>

<script>
import TaskList from '~/components/tasks/TaskList'
import CreateTask from '~/components/tasks/CreateTask'

export default {
  components: {
    TaskList,
    CreateTask
  },
  async asyncData ({ $axios, params }) {
    const project = await $axios.get(`/api/projects/${params.id}`)

    const tasks = await $axios.get(`/api/projects/${params.id}/tasks`)

    return { project: project.data, tasks: tasks.data['hydra:member'] }
  },
  methods: {
    async fetchTasks () {
      const tasks = await this.$axios.get(`/api/projects/${this.project.id}/tasks`)
      this.tasks = tasks.data['hydra:member']
    }
  }
}
</script>
