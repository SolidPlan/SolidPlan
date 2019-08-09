<template>
  <div>
    <v-layout row wrap>
      <template v-for="project in projects">
        <v-flex :key="project.id" xs3 class="pa-2">
          <ProjectItem
            :key="project.id"
            :project="project"
            @update="$emit('refresh')"
            @remove="$emit('refresh')"
          />
        </v-flex>
      </template>
    </v-layout>
  </div>
</template>

<script>
import ProjectItem from '~/components/projects/ProjectItem.vue'

export default {
  components: {
    ProjectItem
  },
  props: {
    projects: {
      type: Array,
      required: true
    }
  }
}
</script>
