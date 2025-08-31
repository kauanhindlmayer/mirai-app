<script setup lang="ts">
import { shortcuts } from '~/composables/useShortcuts'
import { ShortcutCategory } from '~/types'

const { layoutState } = useLayout()

const panelsShortcuts = shortcuts.filter((s) => s.category === ShortcutCategory.Panels)
</script>

<template>
  <Drawer
    v-model:visible="layoutState.isKeyboardShortcutsSidebarVisible"
    position="right"
    header="Keyboard Shortcuts"
    :style="{ width: '340px' }"
    :pt="{ pcCloseButton: { root: 'ml-auto' } }"
  >
    <div class="grid grid-cols-1 gap-4">
      <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <h3 class="font-semibold text-gray-700 dark:text-gray-200 mb-2">Panels</h3>
        <ul class="space-y-2">
          <li
            v-for="(shortcut, index) in panelsShortcuts"
            :key="`panels-${index}`"
            class="flex justify-between items-center"
          >
            <span class="text-sm text-gray-800 dark:text-gray-200">
              {{ shortcut.description }}
            </span>

            <div class="flex space-x-1">
              <span v-if="shortcut.ctrlKey" class="kbd" aria-label="Ctrl"> Ctrl </span>
              <span v-if="shortcut.shiftKey" class="kbd" aria-label="Shift"> Shift </span>
              <span v-if="shortcut.altKey" class="kbd" aria-label="Alt"> Alt </span>
              <span>+</span>
              <span class="kbd">{{ shortcut.key }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Drawer>
</template>

<style scoped>
.kbd {
  background-color: rgb(243 244 246);
  color: rgb(31 41 55);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  white-space: nowrap;
}
</style>
