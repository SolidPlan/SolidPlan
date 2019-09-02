import { DetailComponent, RootState, StateContext } from "../types/state";
import { ActionContext, ActionTree, MutationTree } from "vuex";

export const state = (): RootState => ({
  showLabels: Boolean(JSON.parse(localStorage.getItem('showLabels') || 'true')),
  theme: Boolean(JSON.parse(localStorage.getItem('theme') || 'false')),
  detailViewActive: false,
  detailViewComponent: {} as DetailComponent
});

export const mutations: MutationTree<RootState> = {
  toggleLabels(state: RootState, value: boolean) {
    state.showLabels = value
  },
  toggleTheme(state: RootState, value: boolean) {
    state.theme = value
  },
  showDetailView(state: RootState, component: DetailComponent) {
    state.detailViewActive = true;
    state.detailViewComponent = Object.freeze(component)
  },
  hideDetailView(state: RootState) {
    state.detailViewActive = false;
    state.detailViewComponent = {} as DetailComponent
  }
};

export const actions: ActionTree<RootState, {}> = {
  async init({commit, dispatch, state}: ActionContext<RootState, {}>, context: StateContext): Promise<void> {
    context.$vuetify.theme.dark = state.theme;
    commit('toggleTheme', state.theme);

    await Promise.all([
      dispatch('projects/init', context),
      dispatch('tasks/init', context),
      dispatch('labels/init', context),
      dispatch('users/init', context)
    ])
  },

  async reset({dispatch}: ActionContext<RootState, {}>, context: StateContext): Promise<void> {
    await Promise.all([
      dispatch('projects/reset', context),
      dispatch('tasks/reset', context),
      dispatch('labels/reset', context),
      dispatch('users/reset', context)
    ])
  },

  async toggleLabels({commit, state}: ActionContext<RootState, {}>): Promise<void> {
    await localStorage.setItem('showLabels', JSON.stringify(!state.showLabels));
    commit('toggleLabels', !state.showLabels)
  },

  async toggleTheme({commit, state}: ActionContext<RootState, {}>, context: StateContext): Promise<void> {
    context.$vuetify.theme.dark = !state.theme;
    await localStorage.setItem('theme', JSON.stringify(!state.theme));
    commit('toggleTheme', !state.theme)
  },

  detailView({commit}: ActionContext<RootState, {}>, context: DetailComponent): void {
    commit('showDetailView', context)
  },

  hideDetailView({commit}: ActionContext<RootState, {}>): void {
    commit('hideDetailView')
  }
};
