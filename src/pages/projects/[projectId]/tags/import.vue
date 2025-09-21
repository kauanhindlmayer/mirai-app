<script setup lang="ts">
import { usePrimeVue, type FileUploadSelectEvent } from 'primevue'
import { createTagImportJob, listTagImportJobs } from '~/api/tag-import-jobs'
import { getJobStatusSeverity } from '~/utils/tag'
import { cacheKeys } from '~/utils/cache-keys'

const pageStore = usePageStore()
pageStore.setTitle('Tags - Boards')

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const router = useRouter()

function redirectToTags() {
  router.push(`/projects/${project.value.id}/tags`)
}

const $primevue = usePrimeVue()
const maxFileSizeInBytes = 10 * 1024 * 1024

function formatSize(bytes: number) {
  const k = 1024
  const dm = 3
  const sizes = $primevue.config.locale!.fileSizeTypes

  if (bytes === 0) {
    return `0 ${sizes[0]}`
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))

  return `${formattedSize} ${sizes[i]}`
}

const queryCache = useQueryCache()

const { mutate: createTagImportJobFn } = useMutation({
  mutation: (event: FileUploadSelectEvent) => createTagImportJob(project.value.id, event.files[0]),
  onSuccess: async () => {
    await queryCache.invalidateQueries({ key: cacheKeys.tags.importJobs(project.value.id) })
  },
  onError: displayError,
})

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value.name, route: `/projects/${project.value.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value.id}/boards` },
    { label: 'Tags', route: `/projects/${project.value.id}/tags` },
    { label: 'Import', route: `/projects/${project.value.id}/tags/import` },
  ])
}

const filters = ref<PaginationFilter>({
  page: 1,
  pageSize: 5,
  sort: '',
  searchTerm: '',
})

const { data: tagImportJobs, isLoading } = useQuery({
  key: () => ['tagImportJobs', project.value.id, filters.value],
  query: () => listTagImportJobs(project.value.id, filters.value),
  placeholderData: (previousData) => previousData,
})

onBeforeMount(setBreadcrumbs)
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <div class="font-semibold text-xl mb-4">Import Tags</div>
          <Button
            label="Back to Tags"
            icon="pi pi-arrow-left"
            severity="secondary"
            @click="redirectToTags"
          />
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <div>
              <FileUpload
                name="file"
                accept=".csv,text/csv"
                :max-file-size="maxFileSizeInBytes"
                @select="createTagImportJobFn"
              >
                <template #content="{ files, removeFileCallback }">
                  <div class="flex flex-col gap-4">
                    <ul class="space-y-2">
                      <li
                        v-for="(file, index) in files"
                        :key="file.name"
                        class="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div class="flex items-center gap-3 overflow-hidden">
                          <i class="pi pi-file text-xl text-gray-500 dark:text-gray-400"></i>
                          <div class="flex flex-col overflow-hidden">
                            <span
                              class="font-medium truncate text-gray-800 dark:text-gray-200"
                              :title="file.name"
                            >
                              {{ file.name }}
                            </span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">
                              {{ formatSize(file.size) }}
                            </span>
                          </div>
                        </div>
                        <Button
                          icon="pi pi-times"
                          severity="danger"
                          class="p-button-text p-button-rounded p-button-sm"
                          @click="removeFileCallback(index)"
                        />
                      </li>
                    </ul>
                  </div>
                </template>

                <template #empty>
                  <div
                    class="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg"
                  >
                    <i class="pi pi-cloud-upload text-4xl! text-gray-400" />
                    <span class="text-gray-600">Drag and drop files here to upload.</span>
                    <span class="text-sm text-gray-500"> Supported format: CSV </span>
                  </div>
                </template>
              </FileUpload>
            </div>

            <div class="flex items-center justify-between">
              <div class="font-semibold text-xl my-4">Recently Imported Tags</div>
            </div>

            <div v-if="isLoading" class="flex items-center justify-center py-6">
              <i class="pi pi-spin pi-spinner text-2xl text-gray-500" />
            </div>

            <div v-else>
              <ul class="space-y-2">
                <li
                  v-for="job in tagImportJobs?.items"
                  :key="job.id"
                  class="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div class="flex flex-col">
                    <span
                      class="font-medium text-gray-800 dark:text-gray-200 truncate"
                      :title="job.fileName"
                    >
                      {{ job.fileName }}
                    </span>

                    <div
                      class="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-1"
                    >
                      <span>
                        <Badge :value="job.status" :severity="getJobStatusSeverity(job.status)" />
                      </span>
                      <span>
                        {{ format(job.createdAtUtc, 'MM/dd/yyyy hh:mm a') }}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="flex justify-between mt-4">
                <Button
                  v-if="tagImportJobs?.hasPreviousPage"
                  label="Previous"
                  icon="pi pi-chevron-left"
                  variant="text"
                  @click="filters.page = filters.page - 1"
                />
                <Button
                  v-if="tagImportJobs?.hasNextPage"
                  label="Next"
                  icon="pi pi-chevron-right"
                  variant="text"
                  @click="filters.page = filters.page + 1"
                />
              </div>

              <div
                v-if="!tagImportJobs?.items.length"
                class="py-6 text-center text-gray-500 dark:text-gray-400"
              >
                No import jobs found.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
