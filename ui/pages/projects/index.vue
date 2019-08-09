<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>
        <v-card>
          <create-project @add="fetchProjects" />
        </v-card>
        <project-list :projects="projects" class="mt-5" @refresh="fetchProjects" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ProjectList from '~/components/projects/ProjectList'
import CreateProject from '~/components/projects/CreateProject'

export default {
  components: {
    CreateProject,
    ProjectList
  },
  async asyncData ({ $axios }) {
    const projects = await $axios.get('/api/projects')
    return { projects: projects.data['hydra:member'] }
  },
  methods: {
    async fetchProjects () {
      const projects = await this.$axios.get('/api/projects')
      this.projects = projects.data['hydra:member']
    }
  }
}
</script>
