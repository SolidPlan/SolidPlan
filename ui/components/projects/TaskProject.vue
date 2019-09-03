<template>
  <v-list dense>
    <template v-for="project in projects">
      <v-list-item  @click="assignToProject({task, project})" :key="project.id">
        <v-list-item-title :key="project.id" class="text-center">
          <v-chip
            v-text="project.name"
            small
            :color="project.color"
            class="white--text"
          />
        </v-list-item-title>
      </v-list-item>
    </template>
    <span v-if="task.project">
      <v-divider />
      <v-list-item @click="assignToProject({task, project: null})">
        <v-list-item-title>
          <v-icon x-small color="red">
            mdi-close
          </v-icon>
          Remove from Project
        </v-list-item-title>
      </v-list-item>
    </span>
  </v-list>
</template>

<script lang="ts">
import { Dictionary, keyBy } from 'lodash';
import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import { Project, Task } from '~/types';

const store: BindingHelpers = namespace('tasks');

@Component({})
export default class TaskProject extends Vue {
  @Prop({type: Object as PropType<Task>, required: true}) public task!: Task;

  @store.Action('assignToProject') public assignToProject!: ({task, project}: { task: Task; project?: Project }) => void;

  public get projects (): Dictionary<Project> {
    return keyBy<Project>(this.$store.state.projects.projects, '@id');
  }
}
</script>
