import { ref } from 'vue'

export function useDialog() {
  const isVisible = ref(false)

  function showDialog() {
    isVisible.value = true
  }

  function hideDialog() {
    isVisible.value = false
  }

  return {
    isVisible,
    showDialog,
    hideDialog,
  }
}

export function useDrawer() {
  const isVisible = ref(false)

  function showDrawer() {
    isVisible.value = true
  }

  function hideDrawer() {
    isVisible.value = false
  }

  return {
    isVisible,
    showDrawer,
    hideDrawer,
  }
}
