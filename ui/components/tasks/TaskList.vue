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
    </v-card-actions>
    <v-list class="pa-0" :dense="filteredTasks.length > 0" elevation="12">
      <template v-for="task in filteredTasks">
        <v-divider :key="`${task.id}-divider`" />
        <TaskItem
          :key="task.id"
          :task="task"
          @update="$emit('refresh')"
          @remove="$emit('refresh')"
        />
      </template>
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
  </v-card>
</template>

<script>
import TaskItem from '~/components/tasks/TaskItem.vue'

const filters = {
  all: tasks => [].concat(filters.open(tasks), filters.closed(tasks)),
  open: tasks => tasks.filter(task => task.status === 'open'),
  closed: tasks => tasks.filter(task => task.status === 'closed')
}

export default {
  components: {
    TaskItem
  },
  props: {
    project: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      filters: Object.freeze(filters),
      visibility: 'open',
      color: null
    }
  },
  computed: {
    tasks () {
      return this.$store.getters['tasks/getTasksByProject'](this.project)
    },
    filteredTasks () {
      return filters[this.visibility](this.tasks)
    }
  },
  methods: {
    markAllDone () {
      this.tasks.forEach((task) => {
        this.$store.dispatch('tasks/markDone', task)
      })
    }
  }
}
</script>
