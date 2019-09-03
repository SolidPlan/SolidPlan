<template>
  <div>
    <v-layout row wrap>
      <template v-for="project in projects">
        <v-flex :key="project.id" xs3 class="pa-2">
          <ProjectItem
            :key="project.id"
            :project="project"
          />
        </v-flex>
      </template>
    </v-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import ProjectItem from '~/components/projects/ProjectItem.vue';
import { Project } from '~/types';

const store: BindingHelpers = namespace('projects');

@Component({
  components: {
    ProjectItem,
  },
})
export default class ProjectList extends Vue {
  @store.State('projects') public readonly projects!: Project[];
}
</script>
