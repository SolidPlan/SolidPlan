import { findIndex } from 'lodash'
import { CrudAction, Initializeable, LabelState, StateContext } from "../types/state";
import { Label } from "~/ui/types";
import { ActionContext, MutationTree } from "vuex";
import Vue from "vue";

export const state = (): LabelState => ({
  labels: []
});

export const mutations: MutationTree<LabelState> = {
  set(state: LabelState, labels: Label[]): void {
    state.labels = labels
  },

  reset(state: LabelState): void {
    state.labels = []
  },

  add(state: LabelState, label: Label): void {
    state.labels.push(label)
  },

  remove(state: LabelState, label: Label): void {
    state.labels.splice(findIndex(state.labels, {'@id': label['@id']}), 1)
  },

  update(state: LabelState, label: Label): void {
    const index = findIndex(state.labels, { id: label.id })
    Vue.set(state.labels, index, label)
  }
};

export const actions: CrudAction<LabelState, Label> & Initializeable<LabelState, Label> = {
  async init({state, commit}: ActionContext<LabelState, Label>, context: StateContext): Promise<void> {
    if (state.labels.length === 0) {
      const data = await context.$axios.$get('/api/labels');
      commit('set', data['hydra:member'])
    }
  },

  reset({commit}: ActionContext<LabelState, Label>) {
    commit('reset')
  },

  async add({commit, dispatch}: ActionContext<LabelState, Label>, label: Label): Promise<Label> {
    const data: Label = await this.$axios.$post<Label>('/api/labels', label);

    commit('add', data);

    return data
  },

  async edit({commit, dispatch}: ActionContext<LabelState, Label>, {id, name, color}: Label): Promise<Label> {
    const data: Label = await this.$axios.$put<Label>(`/api/labels/${id}`, {name, color});

    commit('update', data);

    return data
  },

  async remove({commit, dispatch}: ActionContext<LabelState, Label>, label): Promise<void> {
    await this.$axios.$delete(`/api/labels/${label.id}`);

    commit('remove', label)
  }
};
