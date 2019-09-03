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

<script lang="ts">
import { mixins } from 'vue-class-component';
import { Component } from 'vue-property-decorator';
import colors from 'vuetify/src/util/colors';
import { namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import ColorSwatches from '~/assets/mixins/colorSwatches';
import { Project } from '~/types';

const store: BindingHelpers = namespace('projects');

@Component({})
export default class CreateProject extends mixins(ColorSwatches) {
  public name: string | null = null;
  public color: string = colors.grey.base;

  @store.Action('add') public addProject!: (project: Project) => void;

  public async add (): Promise<void> {
    await this.addProject({ name: this.name, color: this.color } as Project);
    this.name = null;
  }
}
</script>

<style>
  .v-text-field.v-text-field--solo .v-input__prepend-outer {
    margin-top: 8px !important;
  }
</style>
