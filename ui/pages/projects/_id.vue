<template>
  <v-layout justify-center align-center row wrap class="ma-12">
    <v-flex>
      <v-toolbar class="mb-3 white--text" :color="project.color">
        <v-toolbar-title>{{ project.name }}</v-toolbar-title>
        <v-spacer />
        <template v-if="$vuetify.breakpoint.smAndUp">
          <v-btn icon color="white">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="white" @click="remove(project)">
            <v-icon>mdi-delete-circle</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-card>
        <keep-alive>
          <create-task :project="project" />
        </keep-alive>
      </v-card>
      <v-card>
        <v-card-text class="pa-0">
          <task-list :project="project" />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import CreateTask from '~/components/tasks/CreateTask.vue';
import TaskList from '~/components/tasks/TaskList.vue';
import { Project } from '~/types';

const projectStore: BindingHelpers = namespace('projects');
@Component({
  components: {
    CreateTask,
    TaskList,
  },
})
export default class ProjectId extends Vue {
    @projectStore.Getter('getProjectById') private readonly getProjectById!: (projectId: number) => Project;
    @projectStore.Action('remove') private readonly removeProject!: (project: Project) => Promise<void>;

    public get project (): Project {
      return this.getProjectById(Number(this.$route.params.id));
    }

    public async remove (): Promise<void> {
      await this.removeProject(this.project);

      this.$router.push({ 'name': 'projects' });
    }
}
</script>
