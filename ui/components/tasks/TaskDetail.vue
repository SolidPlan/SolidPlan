<template>
  <span>
    <template as="prepend">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>
            <v-chip :color="task.status === 'open' ? 'green' : 'red'" class="white--text" small v-text="task.status" />
            <span v-if="!editTitle">
              {{ task.name }} <v-icon small @click="editTitle = true">mdi-pencil</v-icon>
            </span>
            <v-text-field
              v-else
              ref="input"
              v-focus="editTitle"
              clearable
              color="primary"
              hide-details
              maxlength="1023"
              outlined
              :value="task.name"
              @blur="doneEdit"
              @keyup.enter="doneEdit"
              @keyup.esc="cancelEdit"
            >
              <template v-slot:append>
                <v-icon color="success" @click="$refs.input.blur()">
                  mdi-check
                </v-icon>
              </template>
            </v-text-field>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon @click="hideDetailView">mdi-close</v-icon>
        </v-list-item-action>
      </v-list-item>
    </template>

    <v-divider />
    <div>
      <v-layout row wrap class="ma-3">
        <v-flex lg9>
          <v-textarea outlined auto-grow :value="description" label="Description" @change="description = $event" />
          <v-subheader>Labels</v-subheader>
          <TaskLabels :task="task" />
          <div class="mt-5" v-if="task.assigned || task.project">
            <v-subheader>Info</v-subheader>
            <v-card>
              <v-list dense>
                <v-list-item v-if="task.assigned">
                  <v-list-item-content>Assigned To:</v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{ `${usersList[task.assigned].firstName} ${usersList[task.assigned].lastName}` }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="task.project">
                  <v-list-item-content>Project:</v-list-item-content>
                  <v-list-item-content class="align-end">
                    <v-chip
                      v-if="task.project"
                      pill
                      small
                      :color="projects[task.project].color"
                      text-color="white"
                      class="flex-unset"
                    >
                      {{ projects[task.project].name }}
                    </v-chip>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </div>
        </v-flex>
        <v-flex lg3 class="item-actions">
          <v-list>
            <v-subheader>Actions</v-subheader>
            <v-list-item @click="removeTask">
              <v-list-item-icon class="mr-3">
                <v-icon color="red lighten-3">mdi-close</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Delete Task
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="toggleTask">
              <v-list-item-icon class="mr-3">
                <v-icon color="green">mdi-checkbox-marked-circle-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="task.status === 'open' ? 'Complete Task' : 'Re-open Task'" />
            </v-list-item>
            <v-menu offset-y full-width>
              <template v-slot:activator="{ on }">
                <v-list-item v-on="on">
                  <v-list-item-icon class="mr-3">
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title v-text="task.assigned ? 'Re-Assign Task' : 'Assign Task'" />
                </v-list-item>
              </template>
              <TaskUser :task="task" />
            </v-menu>
            <v-menu offset-y full-width>
              <template v-slot:activator="{ on }">
                <v-list-item v-on="on">
                  <v-list-item-icon class="mr-3">
                    <v-icon>mdi-cursor-move</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title v-text="task.project ? 'Move to project' : 'Assign to project'" />
                </v-list-item>
              </template>
              <TaskProject :task="task" />
            </v-menu>
            <TaskLabels :task="task" :show-labels="false">
              <template v-slot:defaultButton="{ on }">
                <v-list-item v-on="on">
                  <v-list-item-icon class="mr-3">
                    <v-icon color="primary">mdi-label</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>
                    Add Label
                  </v-list-item-title>
                </v-list-item>
              </template>
            </TaskLabels>
          </v-list>
        </v-flex>
      </v-layout>
    </div>
  </span>
</template>

<script lang="ts">
import { Dictionary, keyBy } from 'lodash';
import { PropType } from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import focus from '~/assets/directives/focus';
import TaskActions from '~/assets/mixins/taskActions';
import TaskLabels from '~/components/labels/TaskLabels.vue';
import TaskProject from '~/components/projects/TaskProject.vue';
import TaskUser from '~/components/users/TaskUser.vue';
import { Project, Task, User } from '~/types';

const projectStore: BindingHelpers = namespace('projects');

@Component({
  components: {
    TaskLabels,
    TaskProject,
    TaskUser,
  },
  directives: {
    focus,
  },
})
export default class TaskDetail extends mixins(TaskActions) {
  @Prop({type: Object as PropType<Task>, required: true}) public task!: Task;

  @Action('hideDetailView') public hideDetailView!: () => void;

  public get description (): string {
    return this.task.description;
  }

  public set description (value: string) {
      this.edit({id: this.task.id, description: value} as Task);
  }

  public get projects (): Dictionary<Project> {
    return keyBy(this.$store.state.projects.projects, '@id');
  }

  public get usersList (): Dictionary<User> {
    return keyBy(this.$store.state.users.users, '@id');
  }
}
</script>

<style scoped>
  .item-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .v-subheader {
    height: auto;
  }

  .flex-unset {
    flex: unset;
  }
</style>
