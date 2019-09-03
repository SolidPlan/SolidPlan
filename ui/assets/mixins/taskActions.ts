/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import { Project, Task, User } from '~/types';

const store: BindingHelpers = namespace('tasks');

@Component({})
export default class TaskActions extends Vue {
  @Prop({type: Object as PropType<Task>, required: true}) public readonly task!: Task;

  @store.Action('edit') public edit!: (task: Task) => void;
  @store.Action('remove') public remove!: (task: Task) => void;
  @store.Action('toggle') public toggle!: (task: Task) => void;
  @store.Action('removeAssignedUser') public removeAssignedUser!: (task: Task) => void;
  @store.Action('assignToUser') public assignToUser!: ({task, user}: { task: Task; user: User }) => void;
  @store.Action('assignToProject') public assignToProject!: ({task, project}: { task: Task; project?: Project }) => void;

  public editTitle: boolean = false;

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
}
