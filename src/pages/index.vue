<script setup lang="ts">
const { organizationId } = useOrganizationContext()
const router = useRouter()

onMounted(() => {
  router.replace(`/organizations/${organizationId.value || 'default'}/projects`)
})
</script>

<template>
  <div />
</template>
