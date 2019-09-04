<template>
  <v-layout justify-center align-center row wrap class="ma-12">
    <v-flex>
      <v-card>
        <keep-alive>
          <create-project />
        </keep-alive>
      </v-card>
      <project-list class="mt-5" />
    </v-flex>
  </v-layout>
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
