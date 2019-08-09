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
        @keydown.enter="add"
      />
      <v-list-item-action>
        <v-icon color="success" @click="add">
          mdi-check
        </v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      project: null
    }
  },
  methods: {
    ...mapActions({
      addProject: 'projects/add'
    }),
    add () {
      this.addProject(this.project)
      this.project = null
    }
  }
}
</script>
