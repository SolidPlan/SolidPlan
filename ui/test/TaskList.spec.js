import { mount } from '@vue/test-utils'
import TaskList from '~/components/TaskList'

describe('TaskList', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(TaskList, {propsData: {tasks: []}})
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('data has default values', () => {
    let data = TaskList.data();
    expect(data.color).toBe(null)
    expect(data.visibility).toBe('open')
    expect(data.filters).toHaveProperty('all')
    expect(data.filters).toHaveProperty('open')
    expect(data.filters).toHaveProperty('closed')
  })
})
