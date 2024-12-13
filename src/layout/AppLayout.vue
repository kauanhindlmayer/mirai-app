<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import AppConfig from './AppConfig.vue'
import AppSearch from './AppSearch.vue'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import { useLayout } from './composables/layout'

const { layoutConfig, layoutState, isSidebarActive } = useLayout()
const outsideClickListener = ref<((event: MouseEvent) => void) | null>(null)

watch(isSidebarActive, (newValue) => {
  if (newValue) {
    bindOutsideClickListener()
  } else {
    unbindOutsideClickListener()
  }
})

onBeforeUnmount(() => {
  unbindOutsideClickListener()
})

const containerClass = computed(() => {
  return [
    `layout-sidebar-${layoutConfig.menuTheme}`,
    `layout-card-${layoutConfig.cardStyle}`,
    {
      'layout-overlay': layoutConfig.menuMode === 'overlay',
      'layout-static': layoutConfig.menuMode === 'static',
      'layout-slim': layoutConfig.menuMode === 'slim',
      'layout-horizontal': layoutConfig.menuMode === 'horizontal',
      'layout-compact': layoutConfig.menuMode === 'compact',
      'layout-reveal': layoutConfig.menuMode === 'reveal',
      'layout-drawer': layoutConfig.menuMode === 'drawer',
      'layout-overlay-active': layoutState.overlayMenuActive || layoutState.staticMenuMobileActive,
      'layout-mobile-active': layoutState.staticMenuMobileActive,
      'layout-static-inactive':
        layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
      'layout-sidebar-active': layoutState.sidebarActive,
      'layout-sidebar-anchored': layoutState.anchored,
    },
  ]
})

function bindOutsideClickListener() {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event: MouseEvent) => {
      if (isOutsideClicked(event)) {
        layoutState.overlayMenuActive = false
        layoutState.overlaySubmenuActive = false
        layoutState.staticMenuMobileActive = false
        layoutState.menuHoverActive = false
        layoutState.configSidebarVisible = false
      }
    }

    setTimeout(() => {
      document.addEventListener('click', outsideClickListener.value!)
    }, 0)
  }
}

function unbindOutsideClickListener() {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener.value)
    outsideClickListener.value = null
  }
}

function isOutsideClicked(event: MouseEvent) {
  const sidebarEl = document.querySelector('.layout-sidebar')
  const topbarButtonEl = document.querySelector('.topbar-left > a')
  const target = event.target as HTMLElement

  return !(
    sidebarEl?.isSameNode(target) ||
    sidebarEl?.contains(target) ||
    topbarButtonEl?.isSameNode(target) ||
    topbarButtonEl?.contains(target)
  )
}
</script>

<template>
  <div class="layout-wrapper" :class="containerClass">
    <AppSidebar ref="sidebarRef" />
    <div class="layout-content-wrapper">
      <div class="layout-content-wrapper-inside">
        <AppTopbar />
        <div class="layout-content">
          <AppBreadcrumb />
          <router-view />
        </div>
      </div>
    </div>
    <AppConfig />
    <AppSearch />
    <Toast />
    <div class="layout-mask" />
  </div>
</template>
