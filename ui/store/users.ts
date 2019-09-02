/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

import { ActionContext, ActionTree, MutationTree } from 'vuex';
import { Collection, User } from '../types';
import { Initializeable, UserState } from '../types/state';

export const state: () => UserState = (): UserState => ({
  users: [],
});

export const mutations: MutationTree<UserState> = {
  set (userState: UserState, users: User[]): void {
    userState.users = users;
  },

  reset (userState: UserState): void {
    userState.users = [];
  },
};

export const actions: Initializeable<UserState, User> | ActionTree<UserState, User> = {
  async init ({state: userState, commit}: ActionContext<UserState, User>): Promise<void> {
    if (userState.users.length === 0) {
      const data: Collection<User> = await this.$axios.$get<Collection<User>>('/api/users');
      commit('set', data['hydra:member']);
    }
  },

  reset ({commit}: ActionContext<UserState, UserState>): void {
    commit('reset');
  },
};
