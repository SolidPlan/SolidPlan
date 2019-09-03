<template>
  <v-card class="mx-auto white--text" :color="project.color">
    <v-card-title @click="$router.push({'name': 'projects-id', 'params' : {'id': project.id}})">
      {{ project.name }}
    </v-card-title>
    <v-card-actions>
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            color="red"
            text
            icon
            small
            @click="remove(project)"
            v-on="on"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <span>Remove Project</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import { Project } from '~/types';

const store: BindingHelpers = namespace('projects');

@Component({})
export default class ProjectItem extends Vue {
  @Prop({type: Object as PropType<Project>, required: true}) public project!: Project;

  @store.Action('remove') public remove!: (project: Project) => void;
}
</script>

<style>
  .v-card__title {
    cursor: pointer;
  }
</style>
