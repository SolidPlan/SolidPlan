<template>
  <v-container grid-list-xl>
    <v-layout justify-center align-center row wrap>
      <v-flex>
        <v-card>
          <create-task />
        </v-card>

        <task-list show-project />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CreateTask from '~/components/tasks/CreateTask.vue';
import TaskList from '~/components/tasks/TaskList.vue';

@Component({
  components: {
    CreateTask,
    TaskList,
  },
})
export default class TaskIndex extends Vue {}
</script>
