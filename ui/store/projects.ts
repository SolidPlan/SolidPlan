/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

import { find, findIndex, forEach } from 'lodash';
import Vue from 'vue';
import { ActionContext, ActionTree, GetterTree, MutationTree } from '~/node_modules/vuex';
import { Collection, Project, Task } from '~/ui/types';
import { CrudAction, Initializeable, ProjectState } from '../types/state';

export const state: () => ProjectState = (): ProjectState => ({
  projects: [],
});

export const mutations: MutationTree<ProjectState> = {
  set (projectState: ProjectState, projects: Project[]): void {
    projectState.projects = projects;
  },

  reset (projectState: ProjectState): void {
    projectState.projects = [];
  },

  add (projectState: ProjectState, project: Project): void {
    projectState.projects.push(project);
  },

  addTask (projectState: ProjectState, {project, task}: { project: Project; task: Task }): void {
    project.tasks.push(task['@id']);
  },

  remove (projectState: ProjectState, project: Project): void {
    const id: number = project.id;
    Vue.delete(projectState.projects, findIndex(projectState.projects, {id}));
  },

  removeTask (projectState: ProjectState, {project, task}: { project: string; task: Task }): void {
    const proj: Project | undefined = find(projectState.projects, {'@id': project});

    if (proj) {
      proj.tasks.splice(findIndex(proj.tasks, task['@id']), 1);
    }
  },
};

export const actions: (CrudAction<ProjectState, Project> & Initializeable<ProjectState, Project>) | ActionTree<ProjectState, Project> = {
  async init ({state: projectState, commit}: ActionContext<ProjectState, Project>): Promise<void> {
    if (projectState.projects.length === 0) {
      const data: Collection<Project> = await this.$axios.$get<Collection<Project>>('/api/projects');
      commit('set', data['hydra:member']);
    }
  },

  reset ({commit}: ActionContext<ProjectState, Project>): void {
    commit('reset');
  },

  async add ({commit}: ActionContext<ProjectState, Project>, project: Project): Promise<Project> {
    const data: Project = await this.$axios.$post<Project>('/api/projects', project);

    commit('add', data);

    return data;
  },

  addTask ({dispatch, commit}: ActionContext<ProjectState, Project>, task: Task): void {
    commit('addTask', task);
  },

  async remove ({commit, dispatch}: ActionContext<ProjectState, Project>, project: Project): Promise<void> {
    await this.$axios.$delete(`/api/projects/${project.id}`);

    commit('remove', project);

    forEach<string>(project.tasks, (task: string) => commit('tasks/remove', {'@id': task}, {root: true}));
  },

  removeTask ({commit}: ActionContext<ProjectState, Project>, task: Task): void {
    commit('removeTask', task);
  },
};

export const getters: GetterTree<ProjectState, Project> = {
  getProjectById: (projectState: ProjectState): (id: number) => Project | undefined => (id: number): Project | undefined => {
    return find(projectState.projects, {id});
  },
};
