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
            :value="open"
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
            :value="assigned"
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
            :value="closed"
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
import { NuxtApp } from '@nuxt/types/app';
import Component from 'nuxt-class-component';
import Vue from 'vue';
import { namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import StatsCard from "~/components/material/StatsCard.vue";
import TaskList from "~/components/tasks/TaskList.vue";
import { Project } from '~/types';

const projectStore: BindingHelpers = namespace('projects');

@Component({
  components: {
    StatsCard,
    TaskList,
  },
})
export default class Dashboard extends Vue {
  @projectStore.State('projects') public readonly projects!: Project[];

  public async asyncData ({ $axios }: NuxtApp): Promise<{open: number; closed: number; assigned: number}> {
    return await $axios.$get('/api/tasks/stats');
  }
}
</script>
