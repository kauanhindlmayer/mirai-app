<script setup lang="ts">
import { useProjectStore } from '@/stores/project'
import type { Project } from '@/types/project'
import { getInitials } from '@/utils'
import { useRouter } from 'vue-router'

const { project } = defineProps<{ project: Project }>()

const projectStore = useProjectStore()
const router = useRouter()

function redirectToProjectSummary() {
  projectStore.getProject(project.id)
  router.push(`/projects/${project.id}/summary`)
}
</script>

<template>
  <Card class="hover:cursor-pointer" @click="redirectToProjectSummary">
    <template #content>
      <div class="flex items-center gap-4">
        <div class="self-start">
          <Avatar :label="getInitials(project.name)" size="xlarge" />
        </div>
        <div class="w-9/12">
          <div class="text-lg font-semibold">
            {{ project.name }}
          </div>
          <p class="text-sm text-gray-600 line-clamp-3">
            {{ project.description }}
          </p>
        </div>
      </div>
    </template>
  </Card>
</template>
