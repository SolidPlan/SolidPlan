<template>
  <v-list-item class="task-item" :class="{ 'editing': editing }">
    <v-list-item-action>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-hover v-slot:default="{ hover }">
            <v-icon :color="done || hover ? 'success' : ''" @click="toggleTask(task)" v-on="on">
              mdi-checkbox-marked-circle-outline
            </v-icon>
          </v-hover>
        </template>
        <span>{{ done ? 'Re-open Task' : 'Complete Task' }}</span>
      </v-tooltip>
    </v-list-item-action>
    <template v-if="!editing">
      <v-list-item-content
        :class="{ 'primary--text': done, strikethrough }"
        @dblclick="editing = true"
      >
        {{ task.name }}
      </v-list-item-content>
      <v-list-item-action>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              color="red lighten-3"
              text
              icon
              small
              @click="removeTask(task)"
              v-on="on"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Remove Task</span>
        </v-tooltip>
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
    }
  },
  data () {
    return {
      editing: false,
      strikethrough: this.task.status === 'closed'
    }
  },
  computed: {
    done () {
      return this.task.status === 'closed'
    }
  },
  methods: {
    editTask (value) {
      if (value !== this.task.name) {
        this.$axios.put(`/api/tasks/${this.task.id}`, { name: value }).then(() => {
          this.$emit('update')
        })
      }
    },
    removeTask () {
      this.strikethrough = true
      this.$axios.delete(`/api/tasks/${this.task.id}`).then(() => {
        this.$emit('remove', this.task)
      })
    },
    toggleTask () {
      this.strikethrough = !this.done
      this.$axios.put(`/api/tasks/${this.task.id}`, { status: this.done ? 'open' : 'closed' }).then(() => {
        this.task.status = this.done ? 'open' : 'closed'
      })
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
</style>