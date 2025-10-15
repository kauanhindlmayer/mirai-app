<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { number, object, string } from 'yup'
import { updateRetrospective } from '~/api/retrospectives'
import { ProcessTemplate, type Retrospective } from '~/types/retrospective'
import { formatEnumOptions } from '~/utils'

interface Props {
  retrospective?: Retrospective | null
}

const props = withDefaults(defineProps<Props>(), {
  retrospective: null,
})

const { teamId } = useTeamContext()

const isUpdateMode = computed(() => !!props.retrospective)
const dialogTitle = computed(() => `${isUpdateMode.value ? 'Update' : 'Create'} Retrospective`)
const submitButtonLabel = computed(() => (isUpdateMode.value ? 'Update' : 'Create'))

const defaultValues = {
  title: '',
  maxVotesPerUser: 5,
  template: ProcessTemplate.Classic,
}

function getInitialValues(): Partial<Retrospective> {
  if (isUpdateMode.value && props.retrospective) {
    return {
      title: props.retrospective.title,
      maxVotesPerUser: props.retrospective.maxVotesPerUser,
      template: props.retrospective.template,
    }
  }
  return defaultValues
}

const form = ref<Partial<Retrospective>>({ ...getInitialValues() })

watch(() => props.retrospective, resetForm, { immediate: true })

function resetForm() {
  Object.assign(form.value, getInitialValues())
}

const processTemplateOptions = formatEnumOptions(ProcessTemplate)
const titlePlaceholder = computed(() => {
  if (isUpdateMode.value) {
    return 'Enter retrospective title'
  }
  return `Example: Retrospective ${format(new Date(), 'MMM d, yyyy')}`
})

const createRetrospectiveSchema = object({
  title: string().required('Title is a required field'),
  maxVotesPerUser: number().min(3).max(12).required('Max Votes Per User is a required field'),
  template: string().oneOf(Object.values(ProcessTemplate)).required('Template is a required field'),
})

const resolver = ref(yupResolver(createRetrospectiveSchema))
const queryCache = useQueryCache()

const { mutate: createRetrospectiveFn, isLoading: isCreating } = useMutation({
  mutation: (data: Partial<Retrospective>) =>
    createRetrospective({ ...data, teamId: teamId.value! }),
  onSuccess: () => {
    queryCache.invalidateQueries({ key: ['retrospectives', teamId.value!] })
    hideDialog()
  },
})

const { mutate: updateRetrospectiveFn, isLoading: isUpdating } = useMutation({
  mutation: (data: Partial<Retrospective>) =>
    updateRetrospective(props.retrospective!.id, { ...data }),
  onSuccess: () => {
    queryCache.invalidateQueries({ key: ['retrospectives', teamId.value!] })
    queryCache.invalidateQueries({ key: ['retrospective', props.retrospective!.id] })
    hideDialog()
  },
})

const isSubmitting = computed(() => isCreating.value || isUpdating.value)

async function onFormSubmit({ valid }: FormSubmitEvent) {
  if (!valid) return

  if (isUpdateMode.value) {
    updateRetrospectiveFn(form.value)
  } else {
    createRetrospectiveFn(form.value)
  }
}

const { isVisible, showDialog } = useDialog()

function hideDialog() {
  isVisible.value = false
  resetForm()
}

function openDialog() {
  resetForm()
  showDialog()
}

defineExpose({
  showDialog: openDialog,
  hideDialog,
})
</script>

<template>
  <Dialog v-model:visible="isVisible" :style="{ width: '450px' }" modal>
    <template #header>
      <span class="text-surface-900 dark:text-surface-0 text-xl font-bold">
        {{ dialogTitle }}
      </span>
    </template>
    <Form
      :initial-values="getInitialValues()"
      :resolver
      class="flex flex-col h-full"
      @submit="onFormSubmit"
    >
      <FormField v-slot="$field" name="title">
        <label for="title" class="font-medium text-surface-900 dark:text-surface-0">
          Title <small class="text-red-400">*</small>
        </label>
        <InputText
          input-id="title"
          v-model="form.title"
          :placeholder="titlePlaceholder"
          class="w-full"
        />
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField v-slot="$field" name="maxVotesPerUser" class="mt-2">
        <label for="maxVotesPerUser" class="font-medium text-surface-900 dark:text-surface-0">
          Max Votes Per User
          <small class="text-red-400">*</small>
        </label>
        <InputNumber
          input-id="maxVotesPerUser"
          v-model="form.maxVotesPerUser"
          show-buttons
          :min="3"
          :max="12"
          fluid
        />
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField v-slot="$field" name="template" class="mt-2">
        <label for="template" class="font-medium text-surface-900 dark:text-surface-0">
          Template
          <small class="text-red-400">*</small>
        </label>
        <Select
          v-model="form.template"
          class="w-full"
          :options="processTemplateOptions"
          option-label="label"
          option-value="value"
          placeholder="Select a template"
        />
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
          {{ $field.error?.message }}
        </Message>
        <Message severity="warn" size="small" class="mt-4" v-if="isUpdateMode">
          <template #icon>
            <i class="pi pi-exclamation-triangle" />
          </template>
          Existing feedback items will not be preserved when changing the board template.
        </Message>
      </FormField>

      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Cancel" severity="secondary" @click="hideDialog" />
        <Button type="submit" :label="submitButtonLabel" :disabled="isSubmitting" />
      </div>
    </Form>
  </Dialog>
</template>

<style>
.p-dialog {
  border-radius: 0.5rem !important;
}
</style>
