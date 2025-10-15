<script setup lang="ts">
import { extractWisdom } from '~/api/wisdom-extractor'

const pageStore = usePageStore()
pageStore.setTitle('Wisdom Extractor')

const { project } = useProjectContext()

const route = useRoute()
const question = computed(() => route.query.q as string)

const wisdom = ref<WisdomResponse>({
  answer: '',
  sources: [],
})

const { mutate: extractWisdomFn, isLoading } = useMutation({
  mutation: () => extractWisdom(project.value.id, question.value),
  onSuccess: (wisdomResponse: WisdomResponse) => {
    wisdom.value = wisdomResponse
  },
})

const router = useRouter()

function openWorkItemDialog(workItemId: string) {
  router.replace({
    query: {
      ...route.query,
      workItemId,
    },
  })
}

function formatAnswer(answer: string) {
  return answer
    .replace(/\n/g, '<br>')
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/- /g, '• ')
}

function setBreadcrumbs() {
  pageStore.setBreadcrumbs([
    { label: project.value.name, route: `/projects/${project.value.id}/summary` },
    { label: 'Boards', route: `/projects/${project.value.id}/work-items` },
    { label: 'Wisdom Extractor', route: `/projects/${project.value.id}/wisdom-extractor` },
  ])
}

onMounted(() => {
  setBreadcrumbs()
  extractWisdomFn()
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="px-4 py-10 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0">
        <div class="max-w-5xl mx-auto space-y-8">
          <div class="space-y-1">
            <div class="text-xs text-surface-500 uppercase tracking-wider">Search Query</div>
            <div class="text-2xl font-bold break-words leading-snug">
              {{ question }}
            </div>
          </div>

          <div class="space-y-4">
            <h2 class="text-sm font-semibold text-surface-500 uppercase">
              Sources ({{ wisdom.sources.length }})
            </h2>

            <div
              v-if="isLoading"
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <Card v-for="n in 4" :key="n">
                <template #content>
                  <div class="space-y-2">
                    <Skeleton width="100%" height="1rem" />
                    <Skeleton width="100%" height="2rem" />
                    <div class="flex justify-between gap-2 pt-2">
                      <Skeleton width="4rem" height="0.75rem" />
                      <Skeleton width="4rem" height="0.75rem" />
                    </div>
                  </div>
                </template>
              </Card>
            </div>

            <div v-else-if="!wisdom.sources.length" class="text-sm text-surface-500 italic">
              No relevant sources found.
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Card v-for="item in wisdom.sources" :key="item.id">
                <template #content>
                  <div class="space-y-1">
                    <div
                      class="text-sm font-semibold truncate cursor-pointer hover:underline"
                      @click="openWorkItemDialog(item.id)"
                    >
                      {{ item.title }}
                    </div>
                    <p class="text-xs text-surface-700 dark:text-surface-300 line-clamp-2">
                      {{ item.description }}
                    </p>
                    <div
                      class="flex justify-between items-center text-[0.7rem] text-surface-500 dark:text-surface-400 pt-2"
                    >
                      <Badge :value="item.type" :severity="getTypeSeverity(item.type)" />
                      <span>{{ format(item.createdAtUtc ?? item.updatedAtUtc) }}</span>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </div>

          <Card>
            <template #content>
              <div class="space-y-4">
                <h2 class="text-lg font-bold">Answer</h2>

                <div v-if="isLoading" class="text-sm text-surface-500">Generating answer...</div>

                <div
                  v-else-if="wisdom.answer"
                  class="prose dark:prose-invert max-w-none text-sm leading-relaxed"
                  v-html="formatAnswer(wisdom.answer)"
                />

                <div v-else class="text-sm text-surface-500 italic">No answer available.</div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>

  <WorkItemDialog />
</template>
