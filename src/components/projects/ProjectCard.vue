<script setup lang="ts">
import type { Project } from '~/types/project'

const { project } = defineProps<{ project: Project }>()

const router = useRouter()

function redirectToProjectSummary() {
  router.push(`/projects/${project.id}/summary`)
}
</script>

<template>
  <Card class="rounded-lg! hover:cursor-pointer" @click="redirectToProjectSummary">
    <template #content>
      <div class="flex items-start gap-4">
        <div class="self-start">
          <Avatar :label="getInitials(project.name)" size="xlarge" />
        </div>
        <div class="w-9/12">
          <div class="text-lg font-semibold">
            {{ project.name }}
          </div>
          <p class="text-sm text-gray-600 line-clamp-2">
            {{ project.description }}
          </p>
        </div>
      </div>
    </template>
  </Card>
</template>
