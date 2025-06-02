import {
  CardStyle,
  MenuMode,
  MenuTheme,
  Preset,
  Primary,
  type LayoutConfig,
  type LayoutState,
} from '~/types/layout'

const layoutConfig = reactive<LayoutConfig>({
  preset: Preset.Aura,
  primary: Primary.Blue,
  surface: undefined,
  isDarkTheme: false,
  menuMode: MenuMode.Static,
  menuTheme: MenuTheme.Dark,
  cardStyle: CardStyle.Transparent,
})

const layoutState = reactive<LayoutState>({
  staticMenuDesktopInactive: false,
  overlayMenuActive: false,
  rightMenuVisible: false,
  isConfigSidebarVisible: false,
  isKeyboardShortcutsSidebarVisible: false,
  staticMenuMobileActive: false,
  menuHoverActive: false,
  searchBarActive: false,
  sidebarActive: false,
  anchored: false,
  activeMenuItem: null,
  overlaySubmenuActive: false,
})

export function useLayout() {
  function setActiveMenuItem(item: MaybeRef<string | null>) {
    layoutState.activeMenuItem = isRef(item) ? item.value : item
  }

  function onMenuToggle() {
    if (layoutConfig.menuMode === MenuMode.Overlay) {
      layoutState.overlayMenuActive = !layoutState.overlayMenuActive
    }

    if (isDesktop.value) {
      layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive
    } else {
      layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive
    }
  }

  function clearAllSidebars() {
    layoutState.overlayMenuActive = false
    layoutState.overlaySubmenuActive = false
    layoutState.staticMenuMobileActive = false
    layoutState.menuHoverActive = false
    layoutState.isConfigSidebarVisible = false
    layoutState.isKeyboardShortcutsSidebarVisible = false
  }

  function onConfigSidebarToggle() {
    if (isSidebarActive.value) {
      clearAllSidebars()
    }
    layoutState.isConfigSidebarVisible = !layoutState.isConfigSidebarVisible
  }

  function onKeyboardShortcutsSidebarToggle() {
    if (isSidebarActive.value) {
      clearAllSidebars()
    }
    layoutState.isKeyboardShortcutsSidebarVisible = !layoutState.isKeyboardShortcutsSidebarVisible
  }
  function onSearchBarToggle() {
    layoutState.searchBarActive = !layoutState.searchBarActive
  }

  const isDarkTheme = computed(() => layoutConfig.isDarkTheme)
  const isMenuDarkTheme = computed(() => layoutConfig.menuTheme === MenuTheme.Dark)
  const isSidebarActive = computed(() => {
    return (
      layoutState.overlayMenuActive ||
      layoutState.staticMenuMobileActive ||
      layoutState.overlaySubmenuActive
    )
  })
  const isDesktop = computed(() => window.innerWidth > 991)
  const isSlim = computed(() => layoutConfig.menuMode === MenuMode.Slim)
  const isHorizontal = computed(() => layoutConfig.menuMode === MenuMode.Horizontal)
  const isOverlay = computed(() => layoutConfig.menuMode === MenuMode.Overlay)
  const isCompact = computed(() => layoutConfig.menuMode === MenuMode.Compact)
  const isStatic = computed(() => layoutConfig.menuMode === MenuMode.Static)
  const isReveal = computed(() => layoutConfig.menuMode === MenuMode.Reveal)
  const isDrawer = computed(() => layoutConfig.menuMode === MenuMode.Drawer)

  return {
    layoutConfig,
    layoutState,
    isDarkTheme,
    isMenuDarkTheme,
    setActiveMenuItem,
    onConfigSidebarToggle,
    onKeyboardShortcutsSidebarToggle,
    onMenuToggle,
    onSearchBarToggle,
    isSidebarActive,
    isSlim,
    isHorizontal,
    isCompact,
    isOverlay,
    isStatic,
    isReveal,
    isDrawer,
    isDesktop,
  }
}
