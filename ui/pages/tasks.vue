<template>
  <v-container grid-list-xl>
    <v-layout justify-center align-center row wrap>
      <v-flex>
        <v-card>
          <create-task />
        </v-card>

        <task-list show-project />
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
  }
}
</script>
