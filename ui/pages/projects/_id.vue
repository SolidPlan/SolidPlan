<template>
  <span>
    <v-toolbar class="mb-3 white--text" :color="project.color">
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
      <create-task :project="project" />
    </v-card>
    <task-list :project="project" />
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
  computed: {
    project () {
      return this.$store.getters['projects/getProjectById'](Number(this.$route.params.id))
    }
  }
}
</script>
