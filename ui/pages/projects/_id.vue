<template>
  <v-layout justify-center align-center row wrap class="ma-12">
    <v-flex v-if="project">
      <v-toolbar class="mb-3 white--text" :color="project.color" v-if="!editing">
        <v-toolbar-title>
          <template>
            {{ project.name }}
          </template>
        </v-toolbar-title>
        <v-spacer />
        <template v-if="$vuetify.breakpoint.smAndUp">
          <v-btn icon color="white" @click="editProject">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="white" @click="remove(project)">
            <v-icon>mdi-delete-circle</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-list v-else class="mb-3">
        <v-list-item>
          <v-text-field
            v-model="name"
            :label="'Edit Project'"
            autofocus
            autocomplete="off"
            counter="255"
            flat
            maxlength="255"
            placeholder="Enter project name"
            prepend-icon="mdi-file-document-box-check-outline"
            solo
            :rules="projectNameRules"
            @keyup.enter="doneEdit"
            @keyup.esc="cancelEdit"
          >
            <template slot="prepend">
              <v-menu
                allow-overflow
                :close-on-content-click="false"
                disable-keys
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    :color="color"
                    dark
                    fab
                    x-small
                    v-on="on"
                  />
                </template>
                <v-color-picker
                  v-model="color"
                  mode.sync="hexa"
                  :swatches="swatches"
                  show-swatches
                  hide-mode-switch
                />
              </v-menu>
            </template>

            <template v-slot:append>
              <v-icon color="red lighten-3" @click="cancelEdit">
                mdi-close
              </v-icon>
              <v-icon color="success" @click="doneEdit">
                mdi-check
              </v-icon>
            </template>
          </v-text-field>
        </v-list-item>
      </v-list>
      <v-card>
        <keep-alive>
          <create-task :project="project" />
        </keep-alive>
      </v-card>
      <v-card>
        <v-card-text class="pa-0">
          <TaskList :project="project" />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import Focus from '~/assets/directives/focus';
import ColorSwatches from '~/assets/mixins/colorSwatches';
import CreateTask from '~/components/tasks/CreateTask.vue';
import TaskList from '~/components/tasks/TaskList.vue';
import { Project, validator } from '~/types';

const projectStore: BindingHelpers = namespace('projects');

@Component({
  components: {
    CreateTask,
    TaskList,
  },
  directives: {
    Focus,
  },
})
export default class ProjectId extends mixins(ColorSwatches) {
    public editing: boolean = false;
    public name: string = '';
    public color: string = '';

    public projectNameRules: validator[] = [
        (value: string | null): boolean | string => !!value || 'Name cannot be empty.',
    ];

    @projectStore.Action('edit') public edit!: (project: Project) => void;
    @projectStore.Getter('getProjectById') private readonly getProjectById!: (projectId: number) => Project;
    @projectStore.Action('remove') private readonly removeProject!: (project: Project) => Promise<void>;

    public get project (): Project {
      return this.getProjectById(Number(this.$route.params.id));
    }

    public async doneEdit (): Promise<void> {
        if (!this.name) {
            // @TODO: Show error message
        } else if (this.editing) {
            if (this.name !== this.project.name || this.color !== this.project.color) {
              await this.edit({id: this.project.id, name: this.name, color: this.color} as Project);
            }

            this.editing = false;
        }
    }

    public editProject (): void {
        this.editing = true;
        this.name = this.project.name;
        this.color = this.project.color;
    }

    public cancelEdit (): void {
        this.editing = false;
    }

    public async remove (): Promise<void> {
      const result: boolean = await this.$dialog.confirm({
        text: 'Are you sure you want to delete this project?',
        title: 'Warning',
      });

      if (result) {
        await this.removeProject(this.project);

        this.$router.push({'name': 'projects'});
      }
    }
}
</script>
