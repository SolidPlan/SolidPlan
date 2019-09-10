<template>
  <v-list-item class="task-item" :class="{ 'editing': editTitle }" @click="!editTitle ? detailView({component: components.taskDetail, props: { task }}): ''" :ripple="false">
    <v-list-item-action style="flex-direction: unset" class="align-self-center">
      <v-icon v-show="!disableDrag" class="sort-handle">
        mdi-drag
      </v-icon>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-hover v-slot:default="{ hover }">
            <v-icon :color="done || hover ? 'success' : ''" @click.stop="toggleTask" v-on="on">
              mdi-checkbox-marked-circle-outline
            </v-icon>
          </v-hover>
        </template>
        <span>{{ done ? 'Re-open Task' : 'Complete Task' }}</span>
      </v-tooltip>
    </v-list-item-action>
    <v-hover v-slot:default="{ hover }">
      <template v-if="!editTitle">
        <v-list-item-content>
          <v-list-item-title :class="{ 'primary--text': done, 'strikethrough': strikethrough || done }">
            <span class="mr-3">{{ task.name }}</span>
            <template v-if="hover">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" @click.stop="editTitle = true">
                    mdi-pencil
                  </v-icon>
                </template>
                <span>Edit Task</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon color="red lighten-3" @click.stop="removeTask" v-on="on">mdi-close</v-icon>
                </template>
                <span>Remove Task</span>
              </v-tooltip>
            </template>
          </v-list-item-title>
          <v-list-item-subtitle v-if="showLabels">
            <TaskLabels :task="task" />
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
      <v-text-field
        v-else
        ref="input"
        v-focus="editTitle"
        clearable
        color="primary"
        text
        maxlength="1023"
        solo
        :value="task.name"
        :rules="taskTitleRules"
        @blur.stop="doneEdit"
        @keyup.enter.stop="doneEdit"
        @keyup.esc.stop="cancelEdit"
      >
        <template v-slot:append>
          <v-icon color="success" @click="$refs.input.blur()">
            mdi-check
          </v-icon>
        </template>
      </v-text-field>
    </v-hover>

    <div v-if="task.assigned">

      <v-list-item-avatar class="mr-0">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-img :src="`https://www.gravatar.com/avatar/${emailHash}?d=mp`" v-on="on" />
          </template>
          <span>{{ `${usersList[task.assigned].firstName} ${usersList[task.assigned].lastName}` }}</span>
        </v-tooltip>
      </v-list-item-avatar>

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

        <TaskUser :task="task" />
      </v-menu>
    </div>

    <v-list-item-action class="align-self-center flex-row">
      <div :class="{'mr-2': showProject}">

      </div>

      <div v-if="showProject">
        <v-menu offset-y>
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
          <TaskProject :task="task" />
        </v-menu>
      </div>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import { Dictionary, keyBy } from 'lodash';
import md5 from 'md5';
import { mixins } from 'vue-class-component';
import { Component, Prop } from 'vue-property-decorator';
import colors from 'vuetify/lib/util/colors';
import { Action, State } from 'vuex-class';
import focus from '~/assets/directives/focus';
import TaskActions from '~/assets/mixins/taskActions';
import TaskLabels from '~/components/labels/TaskLabels.vue';
import TaskProject from '~/components/projects/TaskProject.vue';
import TaskUser from '~/components/users/TaskUser.vue';
import { Project, User, validator } from '~/types';
import { DetailComponent } from '~/types/state';

const taskDetail: () => Promise<any> = (): Promise<any> => import('~/components/tasks/TaskDetail.vue');

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
export default class TaskItem extends mixins(TaskActions) {
  @Prop({type: Boolean, required: false, default: false}) public showProject!: boolean;
  @Prop({type: Boolean, required: false, default: false}) public disableDrag!: boolean;

  @State('showLabels') public showLabels!: boolean;

  @Action('detailView') public detailView!: (details: DetailComponent) => void;

  public strikethrough: boolean = this.task.status === 'closed';
  public color: string = colors.grey.base;
  public components: {} = { taskDetail };

  public taskTitleRules: validator[] = [
    (value: string | null): boolean | string => !!value || 'Title cannot be empty.',
  ];

  public get done (): boolean {
    return this.task.status === 'closed';
  }

  public get projects (): Dictionary<Project> {
    return keyBy(this.$store.state.projects.projects, '@id');
  }

  public get usersList (): Dictionary<User> {
    return keyBy(this.$store.state.users.users, '@id');
  }

  public get emailHash (): string {
    return this.task.assigned ? md5(this.usersList[this.task.assigned].email) : '';
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

  .sort-handle {
    cursor: move;
  }
</style>
