<template>
  <v-container grid-list-xl>
    <v-layout justify-center align-center row wrap>
      <v-flex>
        <v-card>
          <create-task @add="fetchTasks" />
        </v-card>

        <task-list :tasks="tasks" @refresh="fetchTasks" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TaskList from '~/components/tasks/TaskList'
import CreateTask from '~/components/tasks/CreateTask'

export default {
  components: {
    CreateTask,
    TaskList
  },
  async asyncData ({ $axios }) {
    const tasks = await $axios.get('/api/tasks')
    return { tasks: tasks.data['hydra:member'] }
  },
  methods: {
    async fetchTasks () {
      const tasks = await this.$axios.get('/api/tasks')
      this.tasks = tasks.data['hydra:member']
    }
  }
}
</script>
