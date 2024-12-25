<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout'
import AppMenu from './AppMenu.vue'
import AppTopbar from './AppTopbar.vue'

const { layoutConfig, layoutState, isHorizontal } = useLayout()

let timeoutId: null | ReturnType<typeof setTimeout> = null

function onMouseEnter() {
  if (!layoutState.anchored) {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    layoutState.sidebarActive = true
  }
}

function onMouseLeave() {
  if (!layoutState.anchored) {
    if (!timeoutId) {
      timeoutId = setTimeout(() => (layoutState.sidebarActive = false), 300)
    }
  }
}

function onAnchorToggle() {
  layoutState.anchored = !layoutState.anchored
}
</script>

<template>
  <div class="layout-sidebar" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="sidebar-header">
      <RouterLink to="/" class="logo">
        <img
          class="logo-image"
          :src="
            layoutConfig.menuTheme === 'light'
              ? '/layout/images/logo-dark.svg'
              : '/layout/images/logo-white.svg'
          "
          alt="mirai-layout"
        />
        <span class="app-name title-h7">Mirai</span>
      </RouterLink>
      <button class="layout-sidebar-anchor" type="button" @click="onAnchorToggle" />
    </div>
    <div class="layout-menu-container">
      <AppMenu />
    </div>
    <AppTopbar v-if="isHorizontal" />
  </div>
</template>
