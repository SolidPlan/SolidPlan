<template>
  <v-list-item class="task-item" :class="{ 'editing': editing }">
    <v-list-item-action>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-hover v-slot:default="{ hover }">
            <v-icon :color="done || hover ? 'success' : ''" @click="toggleTask" v-on="on">
              mdi-checkbox-marked-circle-outline
            </v-icon>
          </v-hover>
        </template>
        <span>{{ done ? 'Re-open Task' : 'Complete Task' }}</span>
      </v-tooltip>
    </v-list-item-action>
    <template v-if="!editing">
      <v-list-item-content
        :class="{ 'primary--text': done, strikethrough: strikethrough || done }"
        @dblclick="editing = true"
      >
        {{ task.name }}
        <v-list-item-subtitle>
          <v-chip
            v-for="label in task.labels"
            :key="label"
            x-small
            outlined
            :color="labelList[label].color"
            class="mr-1"
          >
            {{ labelList[label].name }}
          </v-chip>

          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-chip
                pill
                x-small
                outlined
                v-on="on"
              >
                <v-icon x-small>
                  mdi-plus
                </v-icon>
                Add Label
              </v-chip>
            </template>
            <v-list flat>
              <v-list-item-group
                v-model="selectedLabels"
                multiple
                dense
              >
                <v-container
                  style="max-height: 400px"
                  class="overflow-y-auto"
                >
                  <v-row>
                    <v-flex xs12>
                      <v-list-item v-for="label in labels" :key="label.id">
                        <template v-slot:default="{ active, toggle }">
                          <v-list-item-action>
                            <v-checkbox
                              v-model="active"
                            />
                          </v-list-item-action>

                          <v-list-item-content>
                            <v-list-item-title>
                              <v-chip
                                :color="label.color"
                                small
                                outlined
                                v-text="label.name"
                              />
                            </v-list-item-title>
                          </v-list-item-content>
                        </template>
                      </v-list-item>
                    </v-flex>
                  </v-row>
                </v-container>
                <v-divider />
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-icon>mdi-plus</v-icon>
                      Add Label
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action class="ma-0">
        <v-list-item-action-text>
          <v-menu v-if="showProject" offset-y>
            <template v-slot:activator="{ on }">
              <v-chip
                v-if="task.project"
                pill
                small
                :color="projects[task.project].color"
                text-color="white"
                v-on="on"
              >
                {{ projects[task.project].name }}
              </v-chip>
              <v-chip
                v-else
                pill
                x-small
                outlined
                v-on="on"
              >
                + Add to project
              </v-chip>
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
                @click="removeTask(task)"
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
      v-focus="editing"
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

<script>
import { chunk, filter, keyBy, map, includes, keys, pickBy } from 'lodash'
import colors from 'vuetify/es5/util/colors'

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
  props: {
    task: {
      type: Object,
      required: true
    },
    showProject: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      editing: false,
      strikethrough: this.task.status === 'closed',
      selectedLabels: map(keys(pickBy(this.$store.state.labels.list, v => includes(this.task.labels, v['@id']))), Number),
      color: colors.grey.base
    }
  },
  computed: {
    done () {
      return this.task.status === 'closed'
    },
    projects () {
      return keyBy(this.$store.state.projects.list, '@id')
    },
    labels () {
      return this.$store.state.labels.list
    },
    labelList () {
      return keyBy(this.$store.state.labels.list, '@id')
    },
    swatches () {
      return chunk(filter(map(colors, 'base').concat([colors.shades.black])), 4)
    }
  },
  watch: {
    selectedLabels (labels) {
      this.$store.dispatch('tasks/setLabels', { task: this.task, labels: filter(this.labels, (_, k) => includes(labels, k)) })
    }
  },
  methods: {
    editTask (value) {
      if (value !== this.task.name) {
        this.$store.dispatch('tasks/edit', { task: this.task, data: { name: value } })
      }
    },
    removeTask () {
      this.strikethrough = true
      this.$store.dispatch('tasks/remove', this.task)
    },
    toggleTask () {
      this.strikethrough = !this.done
      this.$store.dispatch('tasks/toggle', this.task)
    },
    doneEdit (e) {
      const value = e.target.value.trim()
      if (!value) {
        this.removeTask()
      } else if (this.editing) {
        this.editTask(value)
        this.editing = false
      }
    },
    cancelEdit () {
      this.editing = false
    },
    assignTaskToProject (task, project) {
      this.$store.dispatch('tasks/assignToProject', { task, project })
    }
  }
}
</script>

<style>
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
</style>
