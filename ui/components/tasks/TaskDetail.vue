<template>
  <span>
    <template as="prepend">
      <v-list-item two-line>
        <!--<v-list-item-avatar>
          <img src="https://randomuser.me/api/portraits/women/81.jpg">
        </v-list-item-avatar>-->
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
          <div class="mt-5">
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
              <v-list dense>
                <v-list-item v-for="user in usersList" :key="user.id" @click="assignTaskToUser(task, user)">
                  <v-list-item-title :key="user.id">
                    {{ user.firstName }} {{ user.lastName }}
                  </v-list-item-title>
                </v-list-item>
                <span v-if="task.assigned">
                  <v-divider />
                  <v-list-item @click="removeAssignedUser(task)">
                    <v-list-item-title>
                      <v-icon x-small color="red">
                        mdi-close
                      </v-icon>
                      Remove Assigned User
                    </v-list-item-title>
                  </v-list-item>
                </span>
              </v-list>
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
              <v-list dense>
                <v-list-item v-for="project in projects" :key="project.id" @click="assignTaskToProject(task, project)">
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
                  <v-list-item @click="assignTaskToProject(task, null)">
                    <v-list-item-title>
                      <v-icon x-small color="red">
                        mdi-close
                      </v-icon>
                      Remove from Project
                    </v-list-item-title>
                  </v-list-item>
                </span>
              </v-list>
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

<script>
import { keyBy } from 'lodash'
import { mapActions } from 'vuex'
import TaskLabels from '~/components/labels/TaskLabels.vue'

export default {
  directives: {
    focus (el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          context.$refs.input.focus()
        })
      }
    }
  },
  components: {
    TaskLabels
  },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      editTitle: false,
      itemsPerPageOptions: [4, 8, 12],
      itemsPerPage: 4,
      item: {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
        calcium: '14%',
        iron: '1%'
      }
    }
  },
  computed: {
    description: {
      get () {
        return this.task.description
      },
      set (value) {
        return this.$store.dispatch('tasks/edit', { task: this.task, data: { description: value } })
      }
    },
    projects () {
      return keyBy(this.$store.state.projects.list, '@id')
    },
    usersList () {
      return keyBy(this.$store.state.users.list, '@id')
    }
  },
  methods: {
    ...mapActions(['hideDetailView']),
    editTask (value) {
      if (value !== this.task.name) {
        this.$store.dispatch('tasks/edit', { task: this.task, data: { name: value } })
      }
    },
    doneEdit (e) {
      const value = e.target.value.trim()
      if (!value) {
        // @TODO: Show error message
      } else if (this.editTitle) {
        this.editTask(value)
        this.editTitle = false
      }
    },
    cancelEdit () {
      this.editTitle = false
    },
    removeTask () {
      this.$store.dispatch('tasks/remove', this.task).then(this.hideDetailView)
    },
    toggleTask () {
      this.$store.dispatch('tasks/toggle', this.task)
    },
    removeAssignedUser () {
      this.$store.dispatch('tasks/removeAssignedUser', this.task)
    },
    assignTaskToUser (task, user) {
      this.$store.dispatch('tasks/assignToUser', { task, user })
    },
    assignTaskToProject (task, project) {
      this.$store.dispatch('tasks/assignToProject', { task, project })
    }
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
