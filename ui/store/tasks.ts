/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

import { filter, findIndex, isEmpty, map, slice } from 'lodash';
import Vue from 'vue';
import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import { Collection, Filter, Label, Project, Task, User } from '~/types';
import { CrudAction, Initializeable, TaskState } from '~/types/state';

export const state: () => TaskState = (): TaskState => ({
  tasks: [],
});

export const mutations: MutationTree<TaskState> = {
  set (taskState: TaskState, tasks: Task[]): void {
    taskState.tasks = tasks;
  },

  reset (taskState: TaskState): void {
    taskState.tasks = [];
  },

  add (taskState: TaskState, task: Task): void {
    taskState.tasks.push(task);
  },

  remove (taskState: TaskState, task: Task): void {
    taskState.tasks.splice(findIndex(taskState.tasks, {'@id': task['@id']}), 1);
  },

  toggle (taskState: TaskState, task: Task): void {
    task.status = task.status === 'open' ? 'closed' : 'open';
  },

  assignToProject (taskState: TaskState, {task, project}: { task: Task; project: Project }): void {
    if (project === null) {
      task.project = null;
    } else {
      task.project = project['@id'];
      project.tasks.push(task['@id']);
    }
  },

  removeAssignedUser (taskState: TaskState, task: Task): void {
    task.assigned = null;
  },

  assignToUser (taskState: TaskState, {task, user}: { task: Task; user: string }): void {
    task.assigned = user;
  },

  setLabels (taskState: TaskState, {task, labels}: { task: Task; labels: Label[] }): void {
    task.labels = labels.length === 0 ? [] : map(labels, '@id');
  },

  update (taskState: TaskState, task: Task): void {
    const index: number = findIndex(taskState.tasks, {id: task.id});
    Vue.set(taskState.tasks, index, task);
  },

  updateOrder (taskState: TaskState, {task, order}: { task: Task; order: number }): void {
    task.order = order;
  },
};

export const actions: (CrudAction<TaskState, Task> & Initializeable<TaskState, Task>) | ActionTree<TaskState, Task> = {
  async init ({state: taskState, commit}: ActionContext<TaskState, Task>, {force}: { force: boolean }): Promise<void> {
    if (taskState.tasks.length === 0 || force === true) {
      const data: Collection<Task> = await this.$axios.$get<Collection<Task>>('/api/tasks');
      commit('set', data['hydra:member']);
    }
  },

  reset ({commit}: ActionContext<TaskState, Task>): void {
    commit('reset');
  },

  async add ({commit, dispatch}: ActionContext<TaskState, Task>, {project, task}: { project: Project; task: Task }): Promise<Task> {
    const data: Task = await this.$axios.$post<Task>(`/api/tasks`, {name: task.name, status: 'open', project: project ? project['@id'] : null});

    commit('add', data);

    if (project) {
      await dispatch('projects/addTask', {project, task: data}, {root: true});
    }

    return data;
  },

  async remove ({commit, dispatch}: ActionContext<TaskState, Task>, task: Task): Promise<void> {
    await this.$axios.$delete<Task>(`/api/tasks/${task.id}`);

    if (task.project) {
      await dispatch('projects/removeTask', {project: task.project, task}, {root: true});
    }

    commit('remove', task);
  },

  async toggle ({commit}: ActionContext<TaskState, Task>, task: Task): Promise<void> {
    await this.$axios.$put<Task>(`/api/tasks/${task.id}`, {status: task.status === 'open' ? 'closed' : 'open'});
    commit('toggle', task);
  },

  async markDone ({dispatch}: ActionContext<TaskState, Task>, task: Task): Promise<void> {
    if (task.status === 'open') {
      await dispatch('toggle', task);
    }
  },

  async edit ({commit}: ActionContext<TaskState, Task>, {id, name, description}: Task): Promise<void> {
    const taskData: Task = await this.$axios.$put<Task>(`/api/tasks/${id}`, {name, description});

    commit('update', taskData);
  },

  async assignToProject ({commit}: ActionContext<TaskState, Task>, {task, project}: { task: Task; project: Project }): Promise<void> {
    if (task.project !== (project ? project['@id'] : null)) {
      await this.$axios.$put<Task>(`/api/tasks/${task.id}`, {project: project ? project['@id'] : null});

      if (task.project) {
        await commit('projects/removeTask', {project: task.project, task}, {root: true});
      }

      commit('assignToProject', {task, project});
    }
  },

  async assignToUser ({commit}: ActionContext<TaskState, Task>, {task, user}: { task: Task; user: User }): Promise<void> {
    await this.$axios.$put<Task>(`/api/tasks/${task.id}`, {assigned: user['@id']});
    commit('assignToUser', {task, user: user['@id']});
  },

  async removeAssignedUser ({commit}: ActionContext<TaskState, Task>, task: Task): Promise<void> {
    await this.$axios.$put<Task>(`/api/tasks/${task.id}`, {assigned: null});

    commit('removeAssignedUser', task);
  },

  async setLabels ({commit}: ActionContext<TaskState, Task>, {task, labels}: { task: Task; labels: Label[] }): Promise<void> {
    await this.$axios.$put<Task>(`/api/tasks/${task.id}`, {labels: map<Label>(labels, '@id')});

    commit('setLabels', {task, labels});
  },

  async sort ({commit, dispatch}: ActionContext<TaskState, Task>, {task, order}: { task: Task; order: number }): Promise<void> {
    await this.$axios.$put<Task>(`/api/tasks/${task.id}/sort`, {order});

    commit('updateOrder', {task, order});
    await dispatch('init', {force: true});
  },
};

export const getters: GetterTree<TaskState, Task> = {
  getTasksByProject: (taskState: TaskState): (project?: Project) => Task[] => (project?: Project): Task[] => {
    let tasks: Task[] = taskState.tasks;
    if (project) {
      tasks = filter<Task>(taskState.tasks, {'project': project['@id']});
    }

    return tasks;
  },

  getFilteredTasks: (taskState: TaskState): (filters: Filter) => Task[] => (filters: Filter): Task[] => {
    let tasks: Task[] = taskState.tasks;
    const predicate: {project?: string; assigned?: string; limit?: number} = {};

    if (filters.project) {
      predicate.project = filters.project['@id'];
    }

    if (filters.assigned) {
      predicate.assigned = filters.assigned['@id'];
    }

    if (!isEmpty(predicate)) {
      tasks = filter<Task>(taskState.tasks, predicate);
    }

    if (filters.limit) {
      tasks = slice<Task>(tasks, 0, filters.limit);
    }

    return tasks;
  },
};
