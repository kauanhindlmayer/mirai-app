import { useEventListener } from '@vueuse/core'
import { ShortcutCategory, type Shortcut } from '~/types'

const { onMenuToggle, onConfigSidebarToggle, onSearchBarToggle } = useLayout()

export const shortcuts: Shortcut[] = [
  {
    key: 'b',
    ctrlKey: true,
    description: 'Toggle main menu',
    category: ShortcutCategory.Panels,
    action: onMenuToggle,
  },
  {
    key: ',',
    ctrlKey: true,
    description: 'Toggle config sidebar',
    category: ShortcutCategory.Panels,
    action: onConfigSidebarToggle,
  },
  {
    key: 'k',
    ctrlKey: true,
    description: 'Toggle search bar',
    category: ShortcutCategory.Panels,
    action: onSearchBarToggle,
  },
]

export function useShortcuts() {
  function handleKeyboardShortcuts(event: KeyboardEvent) {
    const shortcut = shortcuts.find(
      (s) =>
        s.key === event.key &&
        !!s.ctrlKey === event.ctrlKey &&
        !!s.shiftKey === event.shiftKey &&
        !!s.altKey === event.altKey,
    )
    if (!shortcut) return
    event.preventDefault()
    shortcut.action()
  }

  useEventListener(window, 'keydown', handleKeyboardShortcuts)

  return {
    shortcuts,
  }
}
