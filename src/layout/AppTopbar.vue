<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import AppBreadcrumb from './AppBreadcrumb.vue'

const store = useUserStore()
const { user } = storeToRefs(store)
const { layoutState, isDarkTheme, onMenuToggle, onConfigSidebarToggle } = useLayout()

type Props = {
  showTopbarLeft?: boolean
}

withDefaults(defineProps<Props>(), {
  showTopbarLeft: true,
})

function toggleSearchBar() {
  layoutState.searchBarActive = !layoutState.searchBarActive
}

function logout() {
  store.logout()
}
</script>

<template>
  <div class="layout-topbar">
    <div v-if="showTopbarLeft" class="topbar-left">
      <a tabindex="0" class="menu-button" @click="onMenuToggle">
        <i class="pi pi-chevron-left" />
      </a>
      <img class="horizontal-logo" src="/layout/images/logo-white.svg" alt="mirai-layout" />
      <span class="topbar-separator" />
      <AppBreadcrumb />
      <img
        class="mobile-logo"
        :src="`/layout/images/logo-${isDarkTheme ? 'white' : 'dark'}.svg`"
        alt="mirai-layout"
      />
    </div>

    <div class="topbar-right">
      <ul class="topbar-menu">
        <li class="right-sidebar-item">
          <a class="right-sidebar-button" @click="toggleSearchBar">
            <i class="pi pi-search" />
          </a>
        </li>
        <li class="right-sidebar-item">
          <a class="app-config-button">
            <i class="pi pi-list-check" />
          </a>
        </li>

        <li class="right-sidebar-item">
          <a class="app-config-button">
            <i class="pi pi-question-circle" />
          </a>
        </li>
        <li class="right-sidebar-item">
          <a class="app-config-button" @click="onConfigSidebarToggle">
            <i class="pi pi-cog" />
          </a>
        </li>

        <li class="profile-item static sm:relative">
          <a
            class="!bg-none !border-none !outline-none"
            v-styleclass="{
              selector: '@next',
              enterFromClass: 'hidden',
              enterActiveClass: 'animate-scalein',
              leaveActiveClass: 'animate-fadeout',
              leaveToClass: 'hidden',
              hideOnOutsideClick: true,
            }"
          >
            <Avatar
              :image="user?.imageUrl || undefined"
              :icon="user?.imageUrl ? undefined : 'pi pi-user'"
              pt:image:class="!rounded-lg"
              class="!w-10 !h-10"
            />
          </a>
          <div
            class="list-none p-2 m-0 rounded-2xl border border-surface overflow-hidden absolute bg-surface-0 dark:bg-surface-900 hidden origin-top w-52 mt-2 right-0 z-[999] top-auto shadow-[0px_56px_16px_0px_rgba(0,0,0,0.00),0px_36px_14px_0px_rgba(0,0,0,0.01),0px_20px_12px_0px_rgba(0,0,0,0.02),0px_9px_9px_0px_rgba(0,0,0,0.03),0px_2px_5px_0px_rgba(0,0,0,0.04)]"
          >
            <ul class="flex flex-col gap-1">
              <li>
                <a
                  class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                >
                  <i class="pi pi-user" />
                  <span>Profile</span>
                </a>
              </li>
              <li>
                <a
                  class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                >
                  <i class="pi pi-cog" />
                  <span>Settings</span>
                </a>
              </li>
              <li>
                <a
                  class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                >
                  <i class="pi pi-calendar" />
                  <span>Calendar</span>
                </a>
              </li>
              <li>
                <a
                  class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                >
                  <i class="pi pi-inbox" />
                  <span>Inbox</span>
                </a>
              </li>
              <li>
                <a
                  class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                  @click="logout"
                >
                  <i class="pi pi-power-off" />
                  <span>Log out</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
