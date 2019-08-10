<template>
  <v-list>
    <v-list-item>
      <v-text-field
        v-model="task"
        :label="'New task'"
        autofocus
        autocomplete="off"
        clearable
        counter="255"
        flat
        hide-details
        maxlength="255"
        placeholder="Enter new task"
        prepend-icon="mdi-file-document-box-check-outline"
        solo
        @keydown.enter="addTask"
      />
      <v-list-item-action>
        <v-icon color="success" @click="addTask">
          mdi-check
        </v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      task: null
    }
  },
  methods: {
    async addTask () {
      if (this.task) {
        await this.$store.dispatch('tasks/add', this)
        this.task = null
      }
    }
  }
}
</script>
