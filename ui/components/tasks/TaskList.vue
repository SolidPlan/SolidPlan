<template>
  <v-card v-show="tasks.length" class="mt-3">
    <v-card-actions v-show="tasks.length" class="px-3">
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
      <v-spacer />
      <v-icon>mdi-filter-variant</v-icon>
      <v-btn-toggle
        v-show="tasks.length"
        v-model="visibility"
        class="elevation-0"
        mandatory
      >
        <v-btn
          v-for="(val, key) in filters"
          :key="key"
          :value="key"
          class="mx-0"
          color="primary"
          text
          small
          @click="visibility = key"
        >
          {{ key }}
        </v-btn>
      </v-btn-toggle>
      <v-spacer />
      <v-icon
        :color="showLabels ? 'primary' : null"
        @click="toggleLabels(!showLabels)"
      >
        mdi-label
      </v-icon>
    </v-card-actions>
    <v-card-text>
      <v-list class="pa-0" :dense="filteredTasks.length > 0" elevation="12" two-line>
        <draggable v-model="filteredTasks" v-bind="dragOptions" handle=".sort-handle" v-on="{ sort: trackChanges }">
          <template v-for="task in filteredTasks">
            <div>
              <v-divider />
              <TaskItem
                :key="task.id"
                :task="task"
                :show-project="showProject"
                :disable-drag="disableDrag"
              />
            </div>
          </template>
        </draggable>
        <template v-if="!filteredTasks.length">
          <v-list-item class="task-item text-cs-center">
            <v-list-item-content>
              <span class="text-center success--text">
                <v-icon>mdi-party-popper</v-icon> No Tasks
              </span>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import Draggable, { DragOptions, MoveEvent } from 'vuedraggable';
import { Action, namespace, State } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import TaskItem from '~/components/tasks/TaskItem.vue';
import { Project, Task } from '~/types';

const store: BindingHelpers = namespace('tasks');

interface FilterList {
  [key: string]: (tasks: Task[]) => Task[];
}

const filters: FilterList = {
  all: (tasks: Task[]): Task[] => filters.open(tasks)
      .concat(filters.closed(tasks)),
  open: (tasks: Task[]): Task[] => tasks.filter((task: Task) => task.status === 'open'),
  closed: (tasks: Task[]): Task[] => tasks.filter((task: Task) => task.status === 'closed'),
};

@Component({
  components: {
    Draggable,
    TaskItem,
  },
})
export default class TaskList extends Vue {
  @Prop({type: Object as PropType<Project>, required: false, default: null}) public readonly project!: Project;
  @Prop({type: Boolean, required: false, default: false}) public readonly showProject!: boolean;

  @State('showLabels') public readonly showLabels!: boolean;

  @store.Getter('getTasksByProject') public getTasksByProject!: (project?: Project) => Task[];
  @store.Action('sort') public sort!: ({task, order}: {task: Task; order: number}) => void;
  @store.Action('markDone') public markDone!: (task: Task) => void;

  @Action('toggleLabels') public toggleLabels!: () => void;

  public visibility: string = 'open';

  public drag: boolean = false;

  public get disableDrag (): boolean {
    return this.visibility === 'all';
  }

  public get filters(): FilterList {
    return Object.freeze(filters);
  }

  public get dragOptions (): DragOptions {
    return {
      animation: 200,
      disabled: this.disableDrag,
      ghostClass: 'ghost',
      group: 'description',
    };
  }

  public get tasks (): Task[] {
    return this.getTasksByProject(this.project);
  }

  public get filteredTasks (): Task[] {
    return filters[this.visibility](this.tasks);
  }

  public set filteredTasks (value: Task[]) {
  }

  public markAllDone (): void {
    this.tasks.forEach(this.markDone);
  }

  public trackChanges ({ oldIndex, newIndex }: MoveEvent<Task>): void {
    const order: number = this.filteredTasks[newIndex].order;
    this.sort({ task: this.filteredTasks[oldIndex], order });
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
