<template>
  <span>
    <v-dialog
      v-model="value"
      max-width="600px"
      persistent
      scrollable
      @input="$emit('input', $event.target.value)"
    >
      <v-card>
        <v-card-title>Edit Labels</v-card-title>
        <v-divider />
        <v-card-text
          id="LabelCard"
          style="height: 300px;"
        >
          <v-list>
            <v-list-item>
              <v-text-field
                ref="input"
                v-model="name"
                v-focus="editing"
                :label="'Add Label'"
                autofocus
                autocomplete="off"
                clearable
                counter="255"
                flat
                hide-details
                maxlength="255"
                placeholder="Add label"
                prepend-icon="mdi-file-document-box-check-outline"
                solo
                @click:clear="reset"
                @keydown.enter="save"
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
                <v-icon color="success" @click="save">
                  mdi-check
                </v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-list-item
              v-for="label in labels"
              :key="label.id"
            >
              <v-list-item-action>
                <v-icon @click="remove(label)">
                  mdi-close
                </v-icon>
              </v-list-item-action>
              <v-list-item-title>
                <v-icon :color="label.color">
                  mdi-label
                </v-icon>
                {{ label.name }}
              </v-list-item-title>
              <v-list-item-action>
                <v-icon @click="edit(label)">
                  mdi-pencil
                </v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="$emit('input', false)">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import colors from 'vuetify/es5/util/colors'
import { mapState, mapActions } from 'vuex'
import { chunk, filter, map } from 'lodash'

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
    value: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {
      editing: null,
      name: null,
      color: colors.grey.base
    }
  },
  computed: {
    ...mapState({
      labels: state => state.labels.labels
    }),
    swatches () {
      return chunk(filter(map(colors, 'base').concat([colors.shades.black])), 4)
    }
  },
  methods: {
    ...mapActions({
      addLabel: 'labels/add',
      editLabel: 'labels/edit',
      remove: 'labels/remove'
    }),
    save () {
      if (this.editing === null) {
        this.addLabel({ name: this.name, color: this.color })
      } else {
        this.editLabel({ id: this.editing.id, name: this.name, color: this.color })
      }
      this.reset()
    },
    edit (label) {
      this.name = String(label.name)
      this.color = String(label.color)
      this.editing = label
      this.$vuetify.goTo(0, { container: '#LabelCard' })
    },
    reset () {
      this.name = null
      this.color = colors.grey.base
      this.editing = null
    }
  }
}
</script>

<style>
  .v-text-field.v-text-field--solo .v-input__prepend-outer {
    margin-top: 8px !important;
  }
</style>
