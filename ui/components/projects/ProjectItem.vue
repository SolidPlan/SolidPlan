<template>
  <v-card class="mx-auto">
    <v-card-title @click="$router.push({'name': 'projects-id', 'params' : {'id': project.id}})">{{ project.name }}</v-card-title>
    <v-card-actions>
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            color="red lighten-3"
            text
            icon
            small
            @click="removeProject(project)"
            v-on="on"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <span>Remove Project</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeProject () {
      this.$axios.delete(`/api/projects/${this.project.id}`).then(() => {
        this.$emit('remove', this.project)
      })
    }
  }
}
</script>

<style>
  .v-card__title {
    cursor: pointer;
  }
</style>
