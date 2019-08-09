<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>
        <v-card>
          <create-project />
        </v-card>
        <project-list class="mt-5" />
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
  }
}
</script>
