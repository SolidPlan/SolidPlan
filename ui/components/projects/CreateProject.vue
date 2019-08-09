<template>
  <v-list>
    <v-list-item>
      <v-text-field
        v-model="project"
        :label="'New project'"
        autofocus
        autocomplete="off"
        clearable
        counter="255"
        flat
        hide-details
        maxlength="255"
        placeholder="Enter new project"
        prepend-icon="mdi-file-document-box-check-outline"
        solo
        @keydown.enter="addProject"
      />
      <v-list-item-action>
        <v-icon color="success" @click="addProject">
          mdi-check
        </v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  data () {
    return {
      project: null
    }
  },
  methods: {
    addProject () {
      if (this.project) {
        this.$axios.post('/api/projects', { 'name': this.project }).then((res) => { this.$emit('add', res.data); this.project = null })
      }
    }
  }
}
</script>
