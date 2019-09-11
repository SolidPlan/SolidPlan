<template>
  <v-card class="mt-3">
    <v-card-actions class="px-3">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-hover v-slot:default="{ hover }">
            <v-icon :color="hover ? 'success' : ''" v-on="on" @click="markAllDone">
              mdi-check-all
            </v-icon>
          </v-hover>
        </template>
        <span>Mark all as done</span>
      </v-tooltip>
      &nbsp;
      {{ totalTasks }} Items
      <v-spacer />
      <v-icon class="mt-3 mr-3">mdi-filter-variant</v-icon>
      <Filters v-bind:filter.sync="filter" :project="project" :assigned="assigned" />
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon
            :color="showLabels ? 'primary' : null"
            @click="toggleLabels(!showLabels)"
            v-on="on"
          >
            mdi-label
          </v-icon>
        </template>
        <span>Show/Hide labels</span>
      </v-tooltip>
    </v-card-actions>
    <v-card-text class="pa-0">
      <v-data-iterator
        :items="tasks"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        :server-items-length="totalTasks"
        :footer-props="{ itemsPerPageOptions: [5, 10, 15, 30, 50, 100] }"
      >
        <template v-slot:default="props">
          <v-list class="py-0" :dense="props.items.length > 0" elevation="2">
            <draggable v-model="props.items" v-bind="dragOptions" handle=".sort-handle" v-on="{ sort: trackChanges }">
              <template v-for="task in props.items">
                <div>
                  <v-divider />
                  <TaskItem
                    :key="task.id"
                    :task="task"
                    :show-project="showProject"
                    @refresh="fetchTasks(taskFilters)"
                  />
                </div>
              </template>
            </draggable>
          </v-list>
        </template>
        <template slot="no-data">
          <v-list class="py-0">
            <v-divider />
            <v-list-item class="task-item text-cs-center">
              <v-list-item-content>
                  <span class="text-center success--text">
                    <v-icon>mdi-party-popper</v-icon> No Tasks
                  </span>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider />
        </template>
      </v-data-iterator>

    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import Draggable, { DragOptions, MoveEvent } from 'vuedraggable';
import { Action, namespace, State } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import Filters from '~/components/tasks/Filters.vue';
import TaskItem from '~/components/tasks/TaskItem.vue';
import { Filter, Project, Task, User } from '~/types';

const store: BindingHelpers = namespace('tasks');

@Component({
  components: {
    Draggable,
    Filters,
    TaskItem,
  },
})
export default class TaskList extends Vue {
  @Prop({type: Object as PropType<Project>, required: false, default: null}) public readonly project!: Project;
  @Prop({type: Object as PropType<User>, required: false, default: null}) public readonly assigned!: User;
  @Prop({type: Boolean, required: false, default: false}) public readonly showProject!: boolean;
  @Prop({type: Number, required: false, default: 15}) public readonly limit!: number;

  @State('showLabels') public readonly showLabels!: boolean;

  @store.State('tasks') public readonly tasks!: Task[];
  @store.State('total') public readonly totalTasks!: number;

  @store.Action('fetch') public fetchTasks!: (filters: Filter) => void;
  @store.Action('sort') public sort!: ({task, order}: {task: Task; order: number}) => void;
  @store.Action('markDone') public markDone!: (task: Task) => void;

  @Action('toggleLabels') public toggleLabels!: () => void;

  public drag: boolean = false;
  public itemsPerPage: number = this.limit;
  public page: number = 1;

  public filter: Filter = {};

  @Watch('page')
  @Watch('itemsPerPage')
  public async onPagination (): Promise<void> {
    await this.fetchTasks(this.taskFilters);
  }

  @Watch('filter', {deep: true})
  public async onFilter (): Promise<void> {
    if (this.page !== 1) {
      this.page = 1; // this will trigger a new fetch, so no need to fetch here
    } else {
      await this.fetchTasks(this.taskFilters);
    }
  }

  public get dragOptions (): DragOptions {
    return {
      animation: 200,
      disabled: false,
      ghostClass: 'ghost',
      group: 'description',
    };
  }

  public get taskFilters (): Filter {
    if (this.project) {
      this.filter['project.id'] = this.project.id;
    }

    if (this.assigned) {
      this.filter['assigned.id'] = this.assigned.id;
    }

    this.filter.limit = this.itemsPerPage;
    this.filter.page = this.page;

    return this.filter;
  }

  public markAllDone (): void {
    if (this.tasks) {
      this.tasks.forEach(this.markDone);
    }
  }

  public async trackChanges ({ oldIndex, newIndex }: MoveEvent<Task>): Promise<void> {
    const order: number = this.tasks[newIndex].order;
    await this.sort({ task: this.tasks[oldIndex], order });
    await this.fetchTasks(this.taskFilters);
  }

  public mounted (): void {
    this.$event.$on('refresh',  () => this.fetchTasks(this.taskFilters));
  }

  public beforeDestroy (): void {
    this.$event.$off('refresh');
  }
}
</script>

<style scoped>
.ghost {
  border: 2px dotted #c8ebfb;
}

.ghost > * {
  opacity: 0;
}
</style>
