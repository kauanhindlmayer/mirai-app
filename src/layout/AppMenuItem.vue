<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import { nextTick, onBeforeMount, ref, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLayout } from '~/layout/composables/layout'

const route = useRoute()

const {
  layoutConfig,
  layoutState,
  setActiveMenuItem,
  onMenuToggle,
  isHorizontal,
  isSlim,
  isCompact,
  isDesktop,
  isStatic,
} = useLayout()

type Props = {
  item: MenuItem
  index?: number
  root?: boolean
  parentItemKey?: string | null
  rootIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  index: 0,
  root: true,
  parentItemKey: null,
  rootIndex: 0,
})

const isActiveMenu = ref(false)
const itemKey = ref<string | null>(null)
const subMenuRef = useTemplateRef<HTMLUListElement>('subMenu')
const menuItemRef = useTemplateRef<HTMLLIElement>('menuItem')

onBeforeMount(() => {
  itemKey.value = props.parentItemKey
    ? props.parentItemKey + '-' + props.index
    : String(props.index)

  const activeItem = layoutState.activeMenuItem

  isActiveMenu.value =
    activeItem === itemKey.value || activeItem ? activeItem.startsWith(itemKey.value + '-') : false
  handleRouteChange(route.path)
})

watch(
  () => isActiveMenu.value,
  () => {
    if ((isSlim.value || isCompact.value || isHorizontal.value) && isDesktop) {
      nextTick(() => {
        if (subMenuRef.value && subMenuRef.value.parentElement) {
          calculatePosition(subMenuRef.value, subMenuRef.value.parentElement)
        }
      })
    }
  },
)

watch(
  () => layoutState.activeMenuItem,
  (newVal) => {
    isActiveMenu.value = newVal === itemKey.value || newVal!.startsWith(itemKey.value + '-')
  },
)

watch(
  () => layoutConfig.menuMode,
  () => {
    isActiveMenu.value = false
  },
)

watch(
  () => layoutState.overlaySubmenuActive,
  (newValue) => {
    if (!newValue) {
      isActiveMenu.value = false
    }
  },
)
watch(
  () => route.path,
  (newPath) => {
    if (
      !(isSlim.value || isCompact.value || isHorizontal.value) &&
      props.item.to &&
      props.item.to === newPath
    ) {
      setActiveMenuItem(itemKey)
    } else if (isSlim.value || isCompact.value || isHorizontal.value) {
      isActiveMenu.value = false
    }
  },
)

watch(() => route.path, handleRouteChange)

function handleRouteChange(newPath: string) {
  if (
    !(isSlim.value || isCompact.value || isHorizontal.value) &&
    props.item.to &&
    props.item.to === newPath
  ) {
    setActiveMenuItem(itemKey)
  } else if (isSlim.value || isCompact.value || isHorizontal.value) {
    isActiveMenu.value = false
  }
}

async function handleItemClick(event: Event, item: MenuItem) {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  const { overlayMenuActive, staticMenuMobileActive } = layoutState

  if ((item.to || item.url) && (staticMenuMobileActive || overlayMenuActive)) {
    onMenuToggle()
  }

  if (item.command) {
    item.command({ originalEvent: event, item: item })
  }

  if (item.items) {
    if (
      props.root &&
      isActiveMenu.value &&
      (isSlim.value || isCompact.value || isHorizontal.value)
    ) {
      layoutState.overlaySubmenuActive = false
      layoutState.menuHoverActive = false

      return
    }

    setActiveMenuItem(isActiveMenu.value ? props.parentItemKey : itemKey)

    if (
      props.root &&
      !isActiveMenu.value &&
      (isSlim.value || isCompact.value || isHorizontal.value)
    ) {
      layoutState.overlaySubmenuActive = true
      layoutState.menuHoverActive = true
      isActiveMenu.value = true

      removeAllTooltips()
    }
  } else {
    if (!isDesktop.value) {
      layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive
    }

    if (isSlim.value || isCompact.value || isHorizontal.value) {
      layoutState.overlaySubmenuActive = false
      layoutState.menuHoverActive = false

      return
    }

    setActiveMenuItem(itemKey)
  }
}

function onMouseEnter() {
  if (props.root && (isSlim.value || isCompact.value || isHorizontal.value) && isDesktop) {
    if (!isActiveMenu.value && layoutState.menuHoverActive) {
      setActiveMenuItem(itemKey)
    }
  }
}

function removeAllTooltips() {
  const tooltips = document.querySelectorAll('.p-tooltip')
  tooltips.forEach((tooltip) => {
    tooltip.remove()
  })
}

function calculatePosition(overlay: HTMLUListElement, target: HTMLElement) {
  if (overlay && target) {
    const { left, top } = target.getBoundingClientRect()

    const vHeight = window.innerHeight
    const oHeight = overlay.offsetHeight

    overlay.style.top = ''
    overlay.style.left = ''

    if (isHorizontal.value) {
      overlay.style.left = `${left}px`
    } else if (isSlim.value || isCompact.value) {
      const height = top + oHeight
      overlay.style.top = vHeight < height ? `${top - (height - vHeight)}px` : `${top}px`
    }
  }
}

function isActiveRoute(item: MenuItem) {
  return route.path === item.to
}
</script>

<template>
  <li
    ref="menuItem"
    :class="{
      'layout-root-menuitem': root,
      'active-menuitem': isStatic ? !root && isActiveMenu : isActiveMenu,
    }"
  >
    <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">
      {{ item.label }}
    </div>
    <a
      v-if="(!item.to || item.items) && item.visible !== false"
      :href="item.url"
      @click="handleItemClick($event, item)"
      :class="item.class"
      :target="item.target"
      tabindex="0"
      @mouseenter="onMouseEnter"
      v-tooltip.hover="isCompact && root && !isActiveMenu ? item.label : null"
    >
      <i :class="item.icon" class="layout-menuitem-icon" />
      <span class="layout-menuitem-text label-small text-inherit">
        {{ item.label }}
      </span>
      <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items" />
    </a>
    <RouterLink
      v-if="item.to && !item.items && item.visible !== false"
      @click="handleItemClick($event, item)"
      :class="[item.class, { 'active-route': isActiveRoute(item) }]"
      tabindex="0"
      :to="item.to"
      @mouseenter="onMouseEnter"
      v-tooltip.hover="isCompact && root && !isActiveMenu ? item.label : null"
    >
      <i :class="item.icon" class="layout-menuitem-icon" />
      <span class="layout-menuitem-text label-small text-inherit">
        {{ item.label }}
      </span>
      <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items" />
    </RouterLink>

    <ul
      ref="subMenu"
      :class="{ 'layout-root-submenulist': root }"
      v-if="item.items && item.visible !== false"
    >
      <app-menu-item
        v-for="(child, i) in item.items"
        :key="child.key"
        :index="i"
        :item="child"
        :parentItemKey="itemKey"
        :root="false"
        :rootIndex="props.index"
      />
    </ul>
  </li>
</template>
