<script setup lang="ts">
import { listPersonas } from '~/api/personas'
import CreatePersonaDrawer from '~/components/personas/CreatePersonaDrawer.vue'

const pageStore = usePageStore()
pageStore.setTitle('Personas - Boards')

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const createPersonaDrawerRef =
  useTemplateRef<InstanceType<typeof CreatePersonaDrawer>>('createPersonaDrawer')

const { data: personas } = useQuery({
  key: () => ['personas', project.value.id],
  query: () => listPersonas(project.value.id),
  placeholderData: (previousData) => previousData,
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="flex justify-between items-center">
          <div class="font-semibold text-xl mb-4">Personas</div>
          <Button
            icon="pi pi-plus"
            label="New Persona"
            outlined
            @click="createPersonaDrawerRef?.showDrawer"
          />
        </div>

        <div v-if="!personas?.length" class="flex flex-col items-center gap-4">
          <LazyImage class="w-48 mr-4" src="/layout/images/people.svg" alt="People Image" />
          <div class="flex flex-col items-center">
            <div class="font-medium text-lg">Focus on the people you are building for!</div>
            <div>Create Personas to help your team build the right things.</div>
          </div>
        </div>
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6 mt-4"
        >
          <PersonaCard v-for="persona in personas" :key="persona.id" :persona="persona" />
        </div>

        <CreatePersonaDrawer ref="createPersonaDrawer" />
      </div>
    </div>
  </div>
</template>
