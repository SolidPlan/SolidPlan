<template>
  <span>
    <v-dialog
      :value="labelsDialog"
      max-width="600px"
      persistent
      scrollable
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
          <v-btn color="blue darken-1" text @click="toggleLabelsDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import colors from 'vuetify/src/util/colors';
import { Action, namespace, State } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import focus from '~/assets/directives/focus';
import ColorSwatches from '~/assets/mixins/colorSwatches';
import { Label } from '~/types';

const store: BindingHelpers = namespace('labels');

@Component({
  directives: { focus },
})
export default class Labels extends mixins(ColorSwatches) {
  @State('labelsDialog') public readonly labelsDialog!: boolean;

  public editing: Label | null = null;
  public name: string | null = null;
  public color: string = colors.grey.base;

  @store.State('labels') public readonly labels!: Label[];

  @Action('toggleLabelsDialog') public readonly toggleLabelsDialog!: () => void;
  @store.Action('add') public addLabel!: (label: Label) => void;
  @store.Action('edit') public editLabel!: (label: Label) => void;
  @store.Action('remove') public remove!: (label: Label) => void;

  public save (): void {
    if (this.editing === null) {
        this.addLabel({ name: this.name, color: this.color } as Label);
    } else {
        this.editLabel({ id: this.editing.id, name: this.name, color: this.color } as Label);
    }
    this.reset();
  }

  public edit (label: Label): void {
    this.name = String(label.name);
    this.color = String(label.color);
    this.editing = label;
    this.$vuetify.goTo(0, { container: '#LabelCard' });
  }
  public reset (): void {
    this.name = null;
    this.color = colors.grey.base;
    this.editing = null;
  }
}
</script>

<style>
  .v-text-field.v-text-field--solo .v-input__prepend-outer {
    margin-top: 8px !important;
  }
</style>
