<template>
  <span>
    <template v-if="showLabels">
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
    </template>
    <v-menu :full-width="!showLabels" :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <slot :on="on" name="defaultButton">
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
        </slot>
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
  </span>
</template>

<script>
import { filter, includes, keys, keyBy, map, pickBy } from 'lodash'
import { mapState } from 'vuex'

export default {
  props: {
    task: {
      type: Object,
      required: true
    },
    showLabels: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    ...mapState({
      labels: state => state.labels.list
    }),
    labelList () {
      return keyBy(this.$store.state.labels.list, '@id')
    },
    selectedLabels: {
      get () {
        return map(keys(pickBy(this.$store.state.labels.list, v => includes(this.task.labels, v['@id']))), Number)
      },
      set (value) {
        return this.$store.dispatch('tasks/setLabels', { task: this.task, labels: filter(this.labels, (_, k) => includes(value, k)) })
      }
    }
  }
}
</script>
