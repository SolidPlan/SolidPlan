<template>
  <v-list>
    <v-list-item>
      <v-text-field
        v-model="name"
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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PropType } from 'vue/types/options';
import { namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import { Project, Task } from '~/types';

const store: BindingHelpers = namespace('tasks');

@Component({})
export default class CreateTask extends Vue {
  @Prop({type: Object as PropType<Project>}) public readonly project!: Project;

  public name: string | null = null;

  @store.Action('add') public addTask!: (task: Task) => void;

  public async add (): Promise<void> {
    if (this.name) {
      await this.addTask({name: this.name} as Task);
      this.name = null;
    }
  }
}
</script>
