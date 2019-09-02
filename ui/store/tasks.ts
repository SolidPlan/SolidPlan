import { filter, findIndex, map, orderBy } from 'lodash'
import Vue from 'vue'
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";
import { Label, Project, Task, User } from "~/ui/types";
import { CrudAction, Initializeable, TaskState } from "~/ui/types/state";

export const state = (): TaskState => ({
  tasks: []
});

export const mutations: MutationTree<TaskState> = {
  set(state: TaskState, tasks: Task[]): void {
    state.tasks = tasks
  },

  reset(state: TaskState): void {
    state.tasks = []
  },

  add(state: TaskState, task: Task): void {
    state.tasks.push(task)
  },

  remove(state: TaskState, task: Task): void {
    state.tasks.splice(findIndex(state.tasks, {'@id': task['@id']}), 1)
  },

  toggle(state: TaskState, task: Task): void {
    task.status = task.status === 'open' ? 'closed' : 'open'
  },

  assignToProject(state: TaskState, {task, project}: { task: Task, project: Project }): void {
    if (project === null) {
      task.project = null
    } else {
      task.project = project['@id'];
      project.tasks.push(task['@id'])
    }
  },

  removeAssignedUser(state: TaskState, task: Task): void {
    task.assigned = null
  },

  assignToUser(state: TaskState, {task, user}: { task: Task, user: string }): void {
    task.assigned = user
  },

  setLabels(state: TaskState, {task, labels}: { task: Task, labels: Label[] }): void {
    if (labels.length === 0) {
      task.labels = []
    } else {
      task.labels = map(labels, '@id')
    }
  },

  update(state: TaskState, task: Task): void {
    const index = findIndex(state.tasks, {id: task.id});
    Vue.set(state.tasks, index, task)
  },

  updateOrder(state, {task, order}: { task: Task, order: number }): void {
    task.order = order
  }
};

export const actions: (CrudAction<TaskState, Task> & Initializeable<TaskState, Task>) | ActionTree<TaskState, Task> = {
  async init({state, commit}: ActionContext<TaskState, Task>, {force}: { force: boolean }): Promise<void> {
    if (state.tasks.length === 0 || force === true) {
      const data = await this.$axios.$get('/api/tasks');
      commit('set', data['hydra:member'])
    }
  },

  reset({commit}: ActionContext<TaskState, Task>): void {
    commit('reset')
  },

  async add({commit, dispatch}: ActionContext<TaskState, Task>, {project, task}: { project: Project, task: string }): Promise<Task> {
    const data = await this.$axios.$post<Task>(`/api/tasks`, {name: task, status: 'open', project: project ? project['@id'] : null});

    commit('add', data);

    if (project) {
      await dispatch('projects/addTask', {project, task}, {root: true})
    }

    return data
  },

  async remove({commit, dispatch}: ActionContext<TaskState, Task>, task: Task): Promise<void> {
    await this.$axios.$delete<Task>(`/api/tasks/${task.id}`);

    if (task.project) {
      await dispatch('projects/removeTask', {project: task.project, task}, {root: true})
    }

    commit('remove', task)
  },

  async toggle({commit}: ActionContext<TaskState, Task>, task: Task): Promise<void> {
    await this.$axios.$put<Task>(`/api/tasks/${task.id}`, {status: task.status === 'open' ? 'closed' : 'open'});
    commit('toggle', task)
  },

  async markDone({dispatch}: ActionContext<TaskState, Task>, task: Task): Promise<void> {
    if (task.status === 'open') {
      await dispatch('toggle', task)
    }
  },

  async edit({commit}: ActionContext<TaskState, Task>, {id, name}): Promise<void> {
    const taskData = await this.$axios.$put<Task>(`/api/tasks/${id}`, {name});

    commit('update', {id, name})
  },

  async assignToProject({commit}: ActionContext<TaskState, Task>, {task, project}: { task: Task, project: Project }): Promise<void> {
    if (task.project !== (project ? project['@id'] : null)) {
      await this.$axios.$put<Task>(`/api/tasks/${task.id}`, {project: project ? project['@id'] : null});

      if (task.project) {
        await commit('projects/removeTask', {project: task.project, task}, {root: true})
      }

      commit('assignToProject', {task, project})
    }
  },

  async assignToUser({commit}: ActionContext<TaskState, Task>, {task, user}: { task: Task, user: User }): Promise<void> {
    await this.$axios.$put<Task>(`/api/tasks/${task.id}`, {assigned: user['@id']});
    commit('assignToUser', {task, user: user['@id']})
  },

  async removeAssignedUser({commit}: ActionContext<TaskState, Task>, task: Task): Promise<void> {
    await this.$axios.$put<Task>(`/api/tasks/${task.id}`, {assigned: null});

    commit('removeAssignedUser', task)
  },

  async setLabels({commit}: ActionContext<TaskState, Task>, {task, labels}: { task: Task, labels: Label[] }): Promise<void> {
    await this.$axios.$put<Task>(`/api/tasks/${task.id}`, {labels: map<Label>(labels, '@id')});

    commit('setLabels', {task, labels})
  },

  async sort({commit, dispatch}: ActionContext<TaskState, Task>, {task, order}: { task: Task, order: number }): Promise<void> {
    await this.$axios.$put<Task>(`/api/tasks/${task.id}/sort`, {order});

    commit('updateOrder', {task, order});
    await dispatch('init', {force: true})
  }
};

export const getters: GetterTree<TaskState, Task> = {
  getTasksByProject: state => (project?: Project): Task[] => {
    let tasks = state.tasks;
    if (project) {
      tasks = filter<Task>(state.tasks, {'project': project['@id']});
    }

    return orderBy<Task>(tasks, 'order')
  }
}
