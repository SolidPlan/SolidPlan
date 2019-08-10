<template>
  <v-list>
    <v-list-item>
      <v-text-field
        v-model="name"
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
      >
        <template slot="prepend">
          <v-menu
            allow-overflow
            :close-on-content-click="false"
            disable-keys
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-btn
                :color="color"
                dark
                fab
                x-small
                v-on="on"
              />
            </template>
            <v-color-picker
              v-model="color"
              mode.sync="hexa"
              :swatches="swatches"
              show-swatches
              hide-mode-switch
            />
          </v-menu>
        </template>
      </v-text-field>
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
import colors from 'vuetify/es5/util/colors'
import { chunk, filter, map } from 'lodash'

export default {
  data () {
    return {
      name: null,
      color: colors.grey.base
    }
  },
  computed: {
    swatches () {
      return chunk(filter(map(colors, 'base').concat([colors.shades.black])), 4)
    }
  },
  methods: {
    ...mapActions({
      addProject: 'projects/add'
    }),
    add () {
      this.addProject({ name: this.name, color: this.color })
      this.name = null
    }
  }
}
</script>

<style>
  .v-text-field.v-text-field--solo .v-input__prepend-outer {
    margin-top: 8px !important;
  }
</style>
