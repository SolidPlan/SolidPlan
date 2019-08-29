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
            <!--<v-divider :key="`${task.id}-divider`" />-->
            <TaskItem
              :key="task.id"
              :task="task"
              :show-project="showProject"
              :disable-drag="disableDrag"
              @update="$emit('refresh')"
              @remove="$emit('refresh')"
            />
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

<script>
import { mapState, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import TaskItem from '~/components/tasks/TaskItem.vue'

const filters = {
  all: tasks => filters.open(tasks).concat(filters.closed(tasks)),
  open: tasks => tasks.filter(task => task.status === 'open'),
  closed: tasks => tasks.filter(task => task.status === 'closed')
}

export default {
  components: {
    TaskItem,
    draggable
  },
  props: {
    project: {
      type: Object,
      required: false,
      default: null
    },
    showProject: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      filters: Object.freeze(filters),
      visibility: 'open',
      drag: false
    }
  },
  computed: {
    disableDrag () {
      return this.visibility === 'all'
    },
    dragOptions () {
      return {
        animation: 200,
        disabled: this.disableDrag,
        group: 'description',
        ghostClass: 'ghost'
      }
    },
    tasks () {
      return this.$store.getters['tasks/getTasksByProject'](this.project)
    },
    filteredTasks: {
      get () {
        return filters[this.visibility](this.tasks)
      },
      set (value) {
        return value
      }
    },
    ...mapState(['showLabels'])
  },
  methods: {
    ...mapActions(['toggleLabels']),
    markAllDone () {
      this.tasks.forEach((task) => {
        this.$store.dispatch('tasks/markDone', task)
      })
    },
    trackChanges ({ oldIndex, newIndex }) {
      const order = this.filteredTasks[newIndex].order
      this.$store.dispatch('tasks/sort', { task: this.filteredTasks[oldIndex], order })
    }
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
