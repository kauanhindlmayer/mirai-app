<script setup lang="ts">
import type { Project } from '@/types'
import { useRouter } from 'vue-router'

const { project } = defineProps<{ project: Project }>()

const router = useRouter()

function navigateToProject() {
  router.push(`/p/${project.name}/summary`)
}

function getInitials(): string {
  const parts = project.name.split(' ')
  if (parts.length < 2) {
    return parts[0][0].toUpperCase()
  }
  const firstNameInitial = parts[0][0]
  const lastNameInitial = parts[parts.length - 1][0]
  return (firstNameInitial + lastNameInitial).toUpperCase()
}
</script>

<template>
  <Card class="hover:cursor-pointer" @click="navigateToProject">
    <template #content>
      <div class="flex items-center gap-4">
        <div class="self-start">
          <Avatar :label="getInitials()" size="xlarge" />
        </div>
        <div class="w-9/12">
          <div class="text-lg font-semibold">
            {{ project.name }}
          </div>
          <p class="text-sm text-gray-600 text-wrap">
            {{ project.description }}
          </p>
        </div>
      </div>
    </template>
  </Card>
</template>
