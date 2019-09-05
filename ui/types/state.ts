/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

import { Component, DefaultProps } from 'vue/types/options';
import { Action } from 'vuex';
import { Label, Project, Task, User } from './index';

export interface DetailComponent {
  component: Component;
  props: DefaultProps;
}

export interface RootState {
  showLabels: boolean;
  theme: boolean;
  detailViewActive: boolean;
  detailViewComponent: DetailComponent;
  labelsDialog: boolean;
  labels?: LabelState;
  projects?: ProjectState;
  tasks?: TaskState;
  users?: UserState;
}

export interface UserState {
  users: User[];
}

export interface LabelState {
  labels: Label[];
}

export interface ProjectState {
  projects: Project[];
}

export interface TaskState {
  tasks: Task[];
}

export interface CrudAction<T, S> {
  reset: Action<T, S>;
  add: Action<T, S>;
  edit: Action<T, S>;
  remove: Action<T, S>;
}

export interface Initializeable<T, S> {
  init: Action<T, S>;
}
