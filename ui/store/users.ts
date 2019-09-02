import { User } from "../types"
import { Initializeable, UserState } from "../types/state"
import { ActionContext, ActionTree, MutationTree } from "vuex";

export const state = (): UserState => ({
  users: []
});

export const mutations: MutationTree<UserState> = {
  set(state: UserState, users: User[]): void {
    state.users = users
  },

  reset(state: UserState): void {
    state.users = []
  }
};

export const actions: Initializeable<UserState, User> | ActionTree<UserState, User> = {
  async init({state, commit}: ActionContext<UserState, User>): Promise<void> {
    if (state.users.length === 0) {
      const data = await this.$axios.$get('/api/users');
      commit('set', data['hydra:member'])
    }
  },

  reset({commit}: ActionContext<UserState, UserState>): void {
    commit('reset')
  }
};
