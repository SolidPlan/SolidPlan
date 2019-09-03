<template>
  <v-list-item class="task-item" :class="{ 'editing': editTitle }" @click="detailView({component: components.TaskDetail, props: { task }})" :ripple="false">
    <v-list-item-action style="flex-direction: unset">
      <v-icon v-show="!disableDrag" class="sort-handle">
        mdi-drag
      </v-icon>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-hover v-slot:default="{ hover }">
            <v-icon :color="done || hover ? 'success' : ''" @click.stop="toggle(task)" v-on="on">
              mdi-checkbox-marked-circle-outline
            </v-icon>
          </v-hover>
        </template>
        <span>{{ done ? 'Re-open Task' : 'Complete Task' }}</span>
      </v-tooltip>
    </v-list-item-action>
    <template v-if="!editTitle">
      <v-list-item-content
        :class="{ 'primary--text': done }"
        @dblclick.stop="editTitle = true"
      >
        <v-layout :class="{ strikethrough: strikethrough || done }">
          <v-flex xs10 d-flex v-text="task.name" />
          <v-flex xs2 class="text-right">
            <div v-if="task.assigned">
              {{ `${usersList[task.assigned].firstName} ${usersList[task.assigned].lastName}` }}

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    color="error"
                    x-small
                    @click.stop="removeAssignedUser(task)"
                    v-on="on"
                  >
                    mdi-close
                  </v-icon>
                </template>
                <span>Remove Assigned User</span>
              </v-tooltip>
            </div>
            <div v-else>
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                  <v-chip
                    pill
                    x-small
                    outlined
                    v-on:click.stop="on.click"
                  >
                    <v-icon x-small>
                      mdi-plus
                    </v-icon>
                    Assign to User
                  </v-chip>
                </template>

                <v-list dense>
                  <v-list-item v-for="user in usersList" :key="user.id" @click.stop="assignToUser({task, user})">
                    <v-list-item-title :key="user.id">
                      {{ user.firstName }} {{ user.lastName }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-flex>
        </v-layout>
        <v-list-item-subtitle v-if="task.description" v-text="task.description" />
        <v-list-item-subtitle v-if="showLabels">
          <TaskLabels :task="task" />
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action class="task-actions">
        <v-list-item-action-text>
          <v-menu v-if="showProject" offset-y>
            <template v-slot:activator="{ on }">
              <v-chip
                v-if="task.project"
                pill
                small
                :color="projects[task.project].color"
                text-color="white"
                v-on:click.stop="on.click"
              >
                {{ projects[task.project].name }}
              </v-chip>
              <v-chip
                v-else
                pill
                x-small
                outlined
                v-on:click.stop="on.click"
              >
                + Add to project
              </v-chip>
            </template>
            <v-list dense>
              <v-list-item v-for="project in projects" :key="project.id" @click="assignToProject({task, project})">
                <v-list-item-title :key="project.id">
                  <v-chip
                    x-small
                    :color="project.color"
                    class="project-info"
                  />
                  {{ project.name }}
                </v-list-item-title>
              </v-list-item>
              <span v-if="task.project">
                <v-divider />
                <v-list-item @click="assignToProject({task, project: null})">
                  <v-list-item-title>
                    <v-icon x-small color="red">
                      mdi-close
                    </v-icon>
                    Remove Project
                  </v-list-item-title>
                </v-list-item>
              </span>
            </v-list>
          </v-menu>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                color="red lighten-3"
                text
                icon
                x-small
                @click.stop="remove(task)"
                v-on="on"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Remove Task</span>
          </v-tooltip>
        </v-list-item-action-text>
      </v-list-item-action>
    </template>
    <v-text-field
      v-else
      ref="input"
      v-focus="editTitle"
      clearable
      color="primary"
      text
      flat
      hide-details
      maxlength="1023"
      solo
      :value="task.name"
      @blur="doneEdit"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
    />
  </v-list-item>
</template>

<script lang="ts">
import { Dictionary, keyBy } from 'lodash';
import { mixins } from 'vue-class-component';
import { Component, Prop } from 'vue-property-decorator';
import colors from 'vuetify/src/util/colors';
import { Action, State } from 'vuex-class';
import focus from '~/assets/directives/focus';
import TaskActions from '~/assets/mixins/taskActions';
import TaskLabels from '~/components/labels/TaskLabels.vue';
import TaskDetail from '~/components/tasks/TaskDetail.vue';
import { Project, User } from '~/types';
import { DetailComponent } from '~/types/state';

@Component({
  components: {
    TaskLabels,
  },
  directives: {
    focus,
  },
})
export default class TaskItem extends mixins(TaskActions) {
  @Prop({type: Boolean, required: false, default: false}) public showProject!: boolean;
  @Prop({type: Boolean, required: false, default: false}) public disableDrag!: boolean;

  @State('showLabels') public showLabels!: boolean;

  @Action('detailView') public detailView!: (details: DetailComponent) => void;

  public strikethrough: boolean = this.task.status === 'closed';
  public color: string = colors.grey.base;
  public components: {} = { TaskDetail };

  public get done (): boolean {
    return this.task.status === 'closed';
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
  .task-actions {
    min-width: 150px;
    flex-direction: column;
    align-items: flex-end;
  }

  .strikethrough {
    position: relative;
    color: #999999;
  }

  .strikethrough::after {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: black;
    animation-name: strikethrough;
    animation-duration: 0.2s;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  .project-info.v-chip {
    height: 8px !important;
    padding: 0 4px !important;
  }

  .sort-handle {
    cursor: move;
  }
</style>
