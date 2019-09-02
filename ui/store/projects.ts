import { find, findIndex, forEach } from 'lodash'
import { CrudAction, Initializeable, ProjectState } from "../types/state";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "~/node_modules/vuex";
import { Project, Task } from "~/ui/types";
import Vue from "vue";

export const state = (): ProjectState => ({
  projects: []
});

export const mutations: MutationTree<ProjectState> = {
  set(state, projects): void {
    state.projects = projects
  },

  reset(state): void {
    state.projects = []
  },

  add(state, project): void {
    state.projects.push(project)
  },

  addTask(state, {project, task}: { project: Project, task: Task }): void {
    project.tasks.push(task['@id'])
  },

  remove(state, project): void {
    const id = project.id;
    Vue.delete(state.projects, findIndex(state.projects, {id}))
  },

  removeTask(state, {project, task}: { project: string, task: Task }): void {
    const proj: Project | undefined = find(state.projects, {'@id': project});

    if (proj) {
      proj.tasks.splice(findIndex(proj.tasks, task['@id']), 1)
    }
  }
};

export const actions: (CrudAction<ProjectState, Project> & Initializeable<ProjectState, Project>) | ActionTree<ProjectState, Project> = {
  async init({state, commit}: ActionContext<ProjectState, Project>): Promise<void> {
    if (state.projects.length === 0) {
      const data = await this.$axios.$get('/api/projects');
      commit('set', data['hydra:member'])
    }
  },

  reset({commit}: ActionContext<ProjectState, Project>) {
    commit('reset')
  },

  async add({commit}: ActionContext<ProjectState, Project>, project: Project): Promise<Project> {
    const data = await this.$axios.$post('/api/projects', project);

    commit('add', data);

    return data
  },

  addTask({dispatch, commit}: ActionContext<ProjectState, Project>, task: Task): void {
    commit('addTask', task)
  },

  async remove({commit, dispatch}: ActionContext<ProjectState, Project>, project: Project): Promise<void> {
    await this.$axios.$delete(`/api/projects/${project.id}`);

    commit('remove', project);

    forEach(project.tasks, task => commit('tasks/remove', {'@id': task}, {root: true}))
  },

  removeTask({commit}: ActionContext<ProjectState, Project>, task: Task): void {
    commit('removeTask', task)
  }
};

export const getters: GetterTree<ProjectState, Project> = {
  getProjectById: state => (id: number): Project | undefined => {
    return find(state.projects, {id})
  }
};
