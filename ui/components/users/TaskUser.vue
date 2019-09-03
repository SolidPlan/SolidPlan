<template>
  <v-list dense>
    <template v-for="user in users">
      <v-list-item :key="user.id" @click="assignToUser({task, user})">
        <v-list-item-title :key="user.id">
          {{ user.firstName }} {{ user.lastName }}
        </v-list-item-title>
      </v-list-item>
      <template v-if="task.assigned">
        <v-divider />
        <v-list-item @click="removeAssignedUser(task)">
          <v-list-item-title>
            <v-icon x-small color="red">
              mdi-close
            </v-icon>
            Remove Assigned User
          </v-list-item-title>
        </v-list-item>
      </template>
    </template>
  </v-list>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import { Task, User } from '~/types';

const userStore: BindingHelpers = namespace('users');
const taskStore: BindingHelpers = namespace('tasks');

@Component({})
export default class TaskUser extends Vue {
  @Prop({type: Object as PropType<Task>, required: true}) public readonly task!: Task;
  @taskStore.Action('removeAssignedUser') public removeAssignedUser!: (task: Task) => void;
  @taskStore.Action('assignToUser') public assignToUser!: ({task, user}: { task: Task; user: User }) => void;
  @userStore.State('users') private readonly users!: User[];
}
</script>
