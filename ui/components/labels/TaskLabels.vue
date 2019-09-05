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
            v-on:click.stop="on.click"
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
        </v-list-item-group>
        <v-divider />
        <v-list-item @click="toggleLabelsDialog">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon>mdi-plus</v-icon>
              Add Label
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </span>
</template>

<script lang="ts">
import { Dictionary, filter, includes, keyBy, keys, map, pickBy } from 'lodash';
import Vue, { PropType } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import { Label, Task } from '~/types';

const store: BindingHelpers = namespace('labels');
const taskStore: BindingHelpers = namespace('tasks');

@Component({})
export default class TaskLabels extends Vue {
  @Prop({type: Object as PropType<Task>, required: true}) public readonly task!: Task;
  @Prop({type: Boolean, required: false, default: true}) public readonly showLabels!: boolean;

  @Action('toggleLabelsDialog') public readonly toggleLabelsDialog!: () => void;

  @store.State('labels') public readonly labels!: Label[];
  @taskStore.Action('setLabels') public readonly setLabels!: ({task, labels}: {task: Task; labels: Label[]}) => Promise<void>;

  public get  labelList (): Dictionary<Label> {
    return keyBy<Label>(this.labels, '@id');
  }

  public get selectedLabels (): number[] {
    return map(keys(pickBy(this.labels, (v: Label) => includes(this.task.labels, v['@id']))), Number);
  }

  public set selectedLabels (value: number[]) {
    this.setLabels({ task: this.task, labels: filter(this.labels, (_: Label, k: number) => includes(value, k)) });
  }
}
</script>
