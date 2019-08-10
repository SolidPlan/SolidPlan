<template>
  <v-card class="mx-auto white--text" :color="project.color">
    <v-card-title @click="$router.push({'name': 'projects-id', 'params' : {'id': project.id}})">
      {{ project.name }}
    </v-card-title>
    <v-card-actions>
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            color="red"
            text
            icon
            small
            @click="remove(project)"
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
import { mapActions } from 'vuex'

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions({
      remove: 'projects/remove'
    })
  }
}
</script>

<style>
  .v-card__title {
    cursor: pointer;
  }
</style>
