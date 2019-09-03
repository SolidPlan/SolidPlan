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

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CreateProject from '~/components/projects/CreateProject.vue';
import ProjectList from '~/components/projects/ProjectList.vue';

@Component({
  components: {
    CreateProject,
    ProjectList,
  },
})
export default class ProjectIndex extends Vue {}
</script>
