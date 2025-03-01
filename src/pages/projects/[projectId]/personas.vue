<script setup lang="ts">
import { useTemplateRef } from 'vue'
import LazyImage from '~/components/common/LazyImage.vue'
import CreatePersonaDrawer from '~/components/personas/CreatePersonaDrawer.vue'

const createPersonaDrawerRef =
  useTemplateRef<InstanceType<typeof CreatePersonaDrawer>>('createPersonaDrawer')
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

        <div class="flex flex-col items-center gap-4">
          <LazyImage class="w-48 mr-4" src="/layout/images/people.svg" alt="People Image" />
          <div class="flex flex-col items-center">
            <div class="font-medium text-lg">Focus on the people you are building for!</div>
            <div>Create Personas to help your team build the right things.</div>
          </div>
        </div>
        <CreatePersonaDrawer ref="createPersonaDrawer" />
      </div>
    </div>
  </div>
</template>
