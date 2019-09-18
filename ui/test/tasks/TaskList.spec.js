import TaskList from '~/components/tasks/TaskList';
import { shallowMount } from '@vue/test-utils';
import * as taskStore from '~/store/tasks';
import taskData from '../mock/api/tasks';
import Vuex from 'vuex'

const store = new Vuex.Store({
  modules: {
    tasks: {
      namespaced: true,
      ...taskStore
    }
  }
});

const factory = () => {
  return shallowMount(TaskList, {
    store
  });
};

describe('TaskList', () => {

  test('is a Vue instance', () => {
    const wrapper = factory();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test('matches snapshot', () => {
    expect(factory().element).toMatchSnapshot();
  });

  test('matches snapshot with data', () => {
    store.commit('tasks/set', taskData);
    expect(factory().element).toMatchSnapshot();
  });

  test('data has default values', () => {
    const wrapper = factory();
    expect(wrapper.vm.drag).toBe(false)
  });
});
