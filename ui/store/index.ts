/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

import { NuxtApp } from '@nuxt/types/app';
import { ActionContext, ActionTree, MutationTree } from 'vuex';
import { DetailComponent, RootState } from '~/types/state';

export const state: () => RootState = (): RootState => ({
  detailViewActive: false,
  detailViewComponent: {} as DetailComponent,
  labelsDialog: false,
  showLabels: Boolean(JSON.parse(localStorage.getItem('showLabels') || 'true')),
  theme: Boolean(JSON.parse(localStorage.getItem('theme') || 'false')),
});

export const mutations: MutationTree<RootState> = {
  toggleLabels (rootState: RootState, value: boolean): void {
    rootState.showLabels = value;
  },
  toggleTheme (rootState: RootState, value: boolean): void {
    rootState.theme = value;
  },
  toggleLabelsDialog (rootState: RootState, value: boolean): void {
    rootState.labelsDialog = value;
  },
  showDetailView (rootState: RootState, component: DetailComponent): void {
    rootState.detailViewActive = true;
    rootState.detailViewComponent = Object.freeze(component);
  },
  hideDetailView (rootState: RootState): void {
    rootState.detailViewActive = false;
    rootState.detailViewComponent = {} as DetailComponent;
  },
};

export const actions: ActionTree<RootState, {}> = {
  async init ({commit, dispatch, state: rootState}: ActionContext<RootState, {}>, context: NuxtApp): Promise<void> {
    context.$vuetify.theme.dark = rootState.theme;
    commit('toggleTheme', rootState.theme);

    await Promise.all([
      dispatch('projects/init', context),
      dispatch('tasks/init', context),
      dispatch('labels/init', context),
      dispatch('users/init', context),
    ]);
  },

  async reset ({dispatch}: ActionContext<RootState, {}>, context: NuxtApp): Promise<void> {
    await Promise.all([
      dispatch('projects/reset', context),
      dispatch('tasks/reset', context),
      dispatch('labels/reset', context),
      dispatch('users/reset', context),
    ]);
  },

  async toggleLabels ({commit, state: rootState}: ActionContext<RootState, {}>): Promise<void> {
    await localStorage.setItem('showLabels', JSON.stringify(!rootState.showLabels));
    commit('toggleLabels', !rootState.showLabels);
  },

  toggleLabelsDialog ({commit, state: rootState}: ActionContext<RootState, {}>): void {
    commit('toggleLabelsDialog', !rootState.labelsDialog);
  },

  async toggleTheme ({commit, state: rootState}: ActionContext<RootState, {}>, context: NuxtApp): Promise<void> {
    context.$vuetify.theme.dark = !rootState.theme;
    await localStorage.setItem('theme', JSON.stringify(!rootState.theme));
    commit('toggleTheme', !rootState.theme);
  },

  detailView ({commit}: ActionContext<RootState, {}>, context: DetailComponent): void {
    commit('showDetailView', context);
  },

  hideDetailView ({commit, state: rootState}: ActionContext<RootState, {}>): void {
    if (rootState.detailViewActive) {
      commit('hideDetailView');
    }
  },
};
