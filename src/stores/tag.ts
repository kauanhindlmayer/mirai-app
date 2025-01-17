import type TagGateway from '@/gateways/TagGateway'
import type { CreateTagRequest, Tag } from '@/types/tag'
import { tagGatewayKey } from '@/utils/injection-keys'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { inject, ref } from 'vue'
import { useProjectStore } from './project'

export const useTagStore = defineStore('tags', () => {
  const tagGateway = inject(tagGatewayKey) as TagGateway
  const { project } = storeToRefs(useProjectStore())

  const tags = ref<Tag[]>([])

  async function createTag(request: CreateTagRequest) {
    await tagGateway.createTag(project.value!.id, request)
  }

  async function deleteTag(tagId: string) {
    await tagGateway.deleteTag(project.value!.id, tagId)
  }

  async function updateTag(tagId: string, request: CreateTagRequest) {
    await tagGateway.updateTag(project.value!.id, tagId, request)
  }

  async function listTags(searchTerm?: string) {
    tags.value = await tagGateway.listTags(project.value!.id, searchTerm)
  }

  return {
    tags,
    createTag,
    deleteTag,
    updateTag,
    listTags,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTagStore, import.meta.hot))
}
