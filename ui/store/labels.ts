/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

import { NuxtApp } from '@nuxt/types/app';
import { find, findIndex, forEach } from 'lodash';
import Vue from 'vue';
import { ActionContext, MutationTree } from 'vuex';
import { Collection, Label, Project, Task } from '~/types';
import { CrudAction, Initializeable, LabelState } from '~/types/state';

export const state: () => LabelState = (): LabelState => ({
  labels: [],
});

export const mutations: MutationTree<LabelState> = {
  set (labelState: LabelState, labels: Label[]): void {
    labelState.labels = labels;
  },

  reset (labelState: LabelState): void {
    labelState.labels = [];
  },

  add (labelState: LabelState, label: Label): void {
    labelState.labels.push(label);
  },

  remove (labelState: LabelState, label: Label): void {
    labelState.labels.splice(findIndex(labelState.labels, {'@id': label['@id']}), 1);
  },

  update (labelState: LabelState, label: Label): void {
    const index: number = findIndex(labelState.labels, {id: label.id});
    Vue.set(labelState.labels, index, label);
  },

  addTask (labelState: LabelState, {task, label}: {task: Task; label: Label}): void {
    label.tasks.push(task['@id']);
  },

  removeTask (labelState: LabelState, {task, label}: {task: Task; label: string}): void {
    const l: Label | undefined = find(labelState.labels, {'@id': label});

    if (l) {
      l.tasks.splice(findIndex(l.tasks, task['@id']), 1);
    }
  },
};

export const actions: CrudAction<LabelState, Label> & Initializeable<LabelState, Label> = {
  async init ({state: labelState, commit}: ActionContext<LabelState, Label>, context: NuxtApp): Promise<void> {
    if (labelState.labels.length === 0) {
      const data: Collection<Label> = await context.$axios.$get<Collection<Label>>('/api/labels');
      commit('set', data['hydra:member']);
    }
  },

  reset ({commit}: ActionContext<LabelState, Label>): void {
    commit('reset');
  },

  async add ({commit, dispatch}: ActionContext<LabelState, Label>, label: Label): Promise<Label> {
    const data: Label = await this.$axios.$post<Label>('/api/labels', label);

    commit('add', data);

    return data;
  },

  async edit ({commit, dispatch}: ActionContext<LabelState, Label>, {id, name, color}: Label): Promise<Label> {
    const data: Label = await this.$axios.$put<Label>(`/api/labels/${id}`, {name, color});

    commit('update', data);

    return data;
  },

  async remove ({commit, dispatch}: ActionContext<LabelState, Label>, label: Label): Promise<void> {
    await this.$axios.$delete(`/api/labels/${label.id}`);

    await forEach<string>(label.tasks, async (task: string) => await commit('tasks/removeLabel', {taskId: task, label}, {root: true}));

    commit('remove', label);
  },
};
