<template>
  <v-layout row wrap class="mx-12">
    <v-container fluid>
      <v-row>
        <h1 class="headline">Dashboard</h1>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          lg="3"
        >
          <stats-card
            color="green"
            icon="mdi-folder-multiple-outline"
            title="Projects"
            :value="projects.length"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="3"
        >
          <stats-card
            color="primary"
            icon="mdi-playlist-check"
            title="Open Tasks"
            :value="openTasksCount"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="3"
        >
          <stats-card
            color="red"
            icon="mdi-account-details"
            title="My Tasks"
            :value="assignedTasksCount"
          />
        </v-col>

        <v-col
          cols="12"
          sm="6"
          lg="3"
        >
          <stats-card
            color="teal"
            icon="mdi-format-list-checks"
            title="Completed Tasks"
            :value="closedTasksCount"
          />
        </v-col>
      </v-row>
      <v-row>
        <h1 class="headline">My Tasks</h1>
      </v-row>
      <v-row>
        <v-col cols="12">
          <TaskList :assigned="$auth.user" :limit="5" show-project />
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import StatsCard from "~/components/material/StatsCard.vue";
import TaskList from "~/components/tasks/TaskList.vue";
import { Project, Task, User } from '~/types';

const taskStore: BindingHelpers = namespace('tasks');
const projectStore: BindingHelpers = namespace('projects');

@Component({
  components: {
    StatsCard,
    TaskList,
  },
})
export default class Dashboard extends Vue {
  @taskStore.State('tasks') public readonly tasks!: Task[];
  @projectStore.State('projects') public readonly projects!: Project[];

  public get openTasksCount (): number {
    return this.tasks.filter((value: Task): boolean => value.status === 'open').length;
  }

  public get closedTasksCount (): number {
    return this.tasks.filter((value: Task): boolean => value.status === 'closed').length;
  }

  public get assignedTasksCount (): number {
    const user: Partial<User> = this.$auth.user;

    return this.tasks.filter((value: Task): boolean => value.assigned === user['@id'] && value.status === 'open').length;
  }
}
</script>
