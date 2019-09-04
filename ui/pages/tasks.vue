<template>
  <v-layout justify-center align-center row wrap class="ma-12">
    <v-flex>
      <v-card>
        <keep-alive>
          <create-task />
        </keep-alive>
      </v-card>
      <task-list class="mt-5" show-project />
    </v-flex>
  </v-layout>
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
