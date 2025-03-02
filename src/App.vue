<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

useMeta({
  title: 'Mirai',
  description: {
    name: 'description',
    content:
      'Mirai is a project management tool that aims to help teams collaborate and manage their projects more effectively.',
  },
})

const { onMenuToggle, onConfigSidebarToggle } = useLayout()

const shortcuts: Shortcut[] = [
  {
    key: 'b',
    ctrlKey: true,
    action: onMenuToggle,
  },
  {
    key: ',',
    ctrlKey: true,
    action: onConfigSidebarToggle,
  },
]

function handleKeyboardShortcuts(event: KeyboardEvent) {
  const shortcut = shortcuts.find((s) => s.key === event.key && s.ctrlKey === event.ctrlKey)
  if (!shortcut) return
  event.preventDefault()
  shortcut.action()
}

useEventListener(document, 'keydown', handleKeyboardShortcuts)
</script>

<template>
  <metainfo />
  <Toast />
  <router-view />
</template>
