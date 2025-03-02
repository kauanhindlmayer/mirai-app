import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import ProjectCard from '../src/components/projects/ProjectCard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [],
})

const project = {
  id: '1',
  name: 'Test Project',
  description: 'This is a test project.',
}

let wrapper: VueWrapper

beforeEach(() => {
  wrapper = mount(ProjectCard, {
    props: {
      project,
    },
    global: {
      plugins: [router],
    },
  })
})

it('renders project name and description', () => {
  expect(wrapper.text()).toContain(project.name)
  expect(wrapper.text()).toContain(project.description)
})

it('navigates to project summary page on click', async () => {
  router.push = vi.fn()
  await wrapper.trigger('click')
  expect(router.push).toHaveBeenCalledWith(`/projects/${project.id}/summary`)
})
