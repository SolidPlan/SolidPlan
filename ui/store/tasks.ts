/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

import { difference, find, findIndex, forEach, indexOf, map } from 'lodash';
import { ActionContext, ActionTree, MutationTree } from 'vuex';
import { Collection, Filter, Label, Project, Task, User } from '~/types';
import { CrudAction, Initializeable, TaskState } from '~/types/state';

export const state: () => TaskState = (): TaskState => ({
  tasks: [],
  total: 0,
});

export const mutations: MutationTree<TaskState> = {
  set (taskState: TaskState, tasks: Collection<Task>): void {
    taskState.tasks = tasks['hydra:member'];
    taskState.total = tasks['hydra:totalItems'];
  },

  reset (taskState: TaskState): void {
    taskState.tasks = [];
    taskState.total = 0;
  },

  add (taskState: TaskState, task: Task): void {
    taskState.tasks.push(task);
    taskState.total++;
  },

  remove (taskState: TaskState, task: Task): void {
    taskState.tasks.splice(findIndex(taskState.tasks, {'@id': task['@id']}), 1);
    taskState.total--;
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

  update (taskState: TaskState, {task, taskData}: {task: number; taskData: Task}): void {
    const t: Task | undefined = find(taskState.tasks, {id: task});

    if (t) {
      t.name = taskData.name;
      t.description = taskData.description;
    }
  },

  removeLabel (taskState: TaskState, {taskId, label}: {taskId: string; label: Label}): void {
    const task: Task | undefined = find(taskState.tasks, {'@id': taskId});

    if (task) {
      const index: number = findIndex(task.labels, label['@id']);
      task.labels.splice(index, 1);
    }
  },

  updateOrder (taskState: TaskState, {task, order}: { task: Task; order: number }): void {
    task.order = order;
  },
};

export const actions: CrudAction<TaskState, Task> | ActionTree<TaskState, Task> = {
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

    commit('update', {task: id, taskData});
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
    const originalLabels: string[] = task.labels;

    await this.$axios.$put<Task>(`/api/tasks/${task.id}`, {labels: map<Label>(labels, '@id')});

    commit('setLabels', {task, labels});

    forEach(labels, (label: Label) => {
      if (indexOf(label.tasks, task['@id']) === -1) {
        commit('labels/addTask', {task, label}, {root: true});
      }
    });

    const removedLabels: string[] = difference(originalLabels, task.labels);

    forEach(removedLabels, (label: string) => {
      commit('labels/removeTask', {task, label}, {root: true});
    });
  },

  async sort ({commit, dispatch}: ActionContext<TaskState, Task>, {task, order}: { task: Task; order: number }): Promise<void> {
    await this.$axios.$put<Task>(`/api/tasks/${task.id}/sort`, {order});

    commit('updateOrder', {task, order});
  },

  async fetch ({commit, dispatch}: ActionContext<TaskState, Task>, filters: Filter): Promise<void> {
    const data: Collection<Task> = await this.$axios.$get<Collection<Task>>('/api/tasks', {params: filters});

    commit('set', data);
  },
};
