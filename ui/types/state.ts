import { Action } from "vuex";
import { Component, DefaultProps } from "vue/types/options";
import { VuetifyObject } from "vuetify/types";
import { Label, Project, Task, User } from "./index";
import { NuxtAxiosInstance } from "@nuxtjs/axios";

export interface DetailComponent {
  component: Component
  props: DefaultProps
}

export interface RootState {
  showLabels: boolean,
  theme: boolean,
  detailViewActive: boolean,
  detailViewComponent: DetailComponent,
}

export interface UserState {
  users: User[]
}

export interface LabelState {
  labels: Label[]
}

export interface ProjectState {
  projects: Project[]
}

export interface TaskState {
  tasks: Task[]
}

export interface StateContext {
  $vuetify: VuetifyObject,
  $axios: NuxtAxiosInstance
}

export interface CrudAction<T, S> {
  reset: Action<T, S>,
  add: Action<T, S>,
  edit: Action<T, S>,
  remove: Action<T, S>,
}

export interface Initializeable<T, S> {
  init: Action<T, S>,
}
