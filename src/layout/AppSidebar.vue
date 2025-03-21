<script setup lang="ts">
const { layoutState, isHorizontal, isMenuDarkTheme } = useLayout()

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
          :src="`/layout/images/logo-${isMenuDarkTheme ? 'white' : 'dark'}.svg`"
          alt="mirai-layout"
        />
        <span class="app-name title-h7 mt-0.5">MIRAI</span>
      </RouterLink>
      <button class="layout-sidebar-anchor" type="button" @click="onAnchorToggle" />
    </div>
    <div class="layout-menu-container">
      <AppMenu />
    </div>
    <AppTopbar v-if="isHorizontal" />
  </div>
</template>
