/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

import { find, findIndex } from 'lodash';
import { ActionContext, MutationTree } from 'vuex';
import { CrudAction, Initializeable, UserState } from '~/types/state';
import { Collection, User } from '../types';

export const state: () => UserState = (): UserState => ({
  users: [],
});

export const mutations: MutationTree<UserState> = {
  set (userState: UserState, users: User[]): void {
    userState.users = users;
  },

  add (userState: UserState, user: User): void {
    userState.users.push(user);
  },

  update (userState: UserState, {user, data}: { user: number; data: User }): void {
    const u: User | undefined = find(userState.users, {id: user});

    if (u) {
      u.firstName = data.firstName;
      u.lastName = data.lastName;
      u.email = data.email;
    }
  },

  remove (userState: UserState, user: User): void {
    userState.users.splice(findIndex(userState.users, {'@id': user['@id']}), 1);
  },

  reset (userState: UserState): void {
    userState.users = [];
  },
};

export const actions: CrudAction<UserState, User> & Initializeable<UserState, User> = {
  async init ({state: userState, commit}: ActionContext<UserState, User>): Promise<void> {
    if (userState.users.length === 0) {
      const data: Collection<User> = await this.$axios.$get<Collection<User>>('/api/users');
      commit('set', data['hydra:member']);
    }
  },

  async add ({commit}: ActionContext<UserState, User>, user: User): Promise<void> {
    const data: User = await this.$axios.$post<User>(`/api/users`, user);

    commit('add', data);
  },

  async edit ({commit}: ActionContext<UserState, User>, {id, firstName, lastName, email}: User): Promise<void> {
    const data: User = await this.$axios.$put<User>(`/api/users/${id}`, {firstName, lastName, email});

    commit('update', {user: id, data});
  },

  async remove ({commit}: ActionContext<UserState, User>, user: User): Promise<void> {
    await this.$axios.$delete<User>(`/api/users/${user.id}`);

    commit('remove', user);
  },

  reset ({commit}: ActionContext<UserState, User>): void {
    commit('reset');
  },
};
