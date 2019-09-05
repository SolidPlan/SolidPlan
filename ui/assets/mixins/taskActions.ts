/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import { Task } from '~/types';

const store: BindingHelpers = namespace('tasks');

@Component({})
export default class TaskActions extends Vue {
  public editTitle: boolean = false;

  @Prop({type: Object as PropType<Task>, required: true}) public readonly task!: Task;
  @Action('hideDetailView') public hideDetailView!: () => void;

  @store.Action('edit') public edit!: (task: Task) => void;
  @store.Action('toggle') public toggle!: (task: Task) => void;
  @store.Action('removeAssignedUser') public removeAssignedUser!: (task: Task) => void;
  @store.Action('remove') private remove!: (task: Task) => void;

  public async editTask (value: string): Promise<void> {
    if (value !== this.task.name) {
      await this.edit({id: this.task.id, name: value} as Task);
    }
  }

  public async doneEdit (e: UIEvent): Promise<void> {
    if (!e.target) {
      return;
    }

    const value: string = (e.target as HTMLInputElement).value.trim();

    if (!value) {
      // @TODO: Show error message
    } else if (this.editTitle) {
      await this.editTask(value);
      this.editTitle = false;
    }
  }

  public cancelEdit (): void {
    this.editTitle = false;
  }

  public async removeTask (): Promise<void> {
    const result: boolean = await this.$dialog.confirm({
      text: 'Are you sure you want to delete this task?',
      title: 'Warning',
    });

    if (result) {
      await this.remove(this.task);
      this.hideDetailView();
    }
  }
}
