<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
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

const notificationsBars = [
  {
    id: 'inbox',
    label: 'Inbox',
    badge: '2',
  },
  {
    id: 'general',
    label: 'General',
  },
  {
    id: 'archived',
    label: 'Archived',
  },
]

const selectedNotificationBar = ref(notificationsBars?.[0].id ?? 'inbox')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const notifications: any[] = []

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
    <div v-else />

    <div class="topbar-right">
      <ul class="topbar-menu">
        <li class="right-sidebar-item">
          <a class="right-sidebar-button" @click="toggleSearchBar">
            <i class="pi pi-search" />
          </a>
        </li>
        <li class="right-sidebar-item">
          <button class="app-config-button" @click="onConfigSidebarToggle">
            <i class="pi pi-cog" />
          </button>
        </li>
        <li class="right-sidebar-item static sm:relative">
          <a
            v-styleclass="{
              selector: '@next',
              enterFromClass: 'hidden',
              enterActiveClass: 'animate-scalein',
              leaveActiveClass: 'animate-fadeout',
              leaveToClass: 'hidden',
              hideOnOutsideClick: true,
            }"
            class="right-sidebar-button relative z-50"
          >
            <span class="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2.5" />
            <i class="pi pi-bell" />
          </a>
          <div
            class="list-none m-0 rounded-2xl border border-surface absolute bg-surface-0 dark:bg-surface-900 overflow-hidden hidden origin-top min-w-72 sm:w-[22rem] mt-2 right-0 z-50 top-auto shadow-[0px_56px_16px_0px_rgba(0,0,0,0.00),0px_36px_14px_0px_rgba(0,0,0,0.01),0px_20px_12px_0px_rgba(0,0,0,0.02),0px_9px_9px_0px_rgba(0,0,0,0.03),0px_2px_5px_0px_rgba(0,0,0,0.04)]"
          >
            <div class="p-4 flex items-center justify-between border-b border-surface">
              <span class="label-small text-surface-950 dark:text-surface-0"> Notifications </span>
              <button
                class="py-1 px-2 text-surface-950 dark:text-surface-0 label-x-small hover:bg-emphasis border border-surface rounded-lg shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)] transition-all"
              >
                Mark all as read
              </button>
            </div>
            <div class="flex items-center border-b border-surface">
              <button
                v-for="(item, index) of notificationsBars"
                :key="index"
                @click="selectedNotificationBar = item.id"
                :class="
                  selectedNotificationBar === item.id
                    ? 'border-surface-950 dark:border-surface-0'
                    : 'border-transparent'
                "
                class="px-3.5 py-2 inline-flex items-center border-b gap-2"
              >
                <span
                  :class="
                    selectedNotificationBar === item.id
                      ? 'text-surface-950 dark:text-surface-0'
                      : ''
                  "
                  class="label-small"
                >
                  {{ item.label }}
                </span>
                <Badge
                  v-if="item?.badge"
                  :value="item.badge"
                  severity="success"
                  size="small"
                  class="!rounded-md"
                />
              </button>
            </div>
            <ul
              class="flex flex-col divide-y divide-[var(--surface-border)] max-h-80 overflow-auto"
            >
              <li
                v-for="(item, index) of notifications.find((f) => f.id === selectedNotificationBar)
                  ?.data"
                :key="index"
              >
                <div
                  class="flex items-center gap-3 px-6 py-3.5 cursor-pointer hover:bg-emphasis transition-all"
                >
                  <OverlayBadge value="" severity="danger" class="inline-flex">
                    <Avatar :image="item.image" size="large" pt:image:class="!rounded-lg" />
                  </OverlayBadge>
                  <div class="flex items-center gap-3">
                    <div class="flex flex-col">
                      <span class="label-small text-left text-surface-950 dark:text-surface-0">
                        {{ item.name }}
                      </span>
                      <span class="label-xsmall text-left line-clamp-1">
                        {{ item.description }}
                      </span>
                      <span class="label-xsmall text-left">
                        {{ item.time }}
                      </span>
                    </div>
                    <Badge v-if="item.new" value="" severity="success" />
                  </div>
                </div>
                <span v-if="index !== notifications.length - 1" />
              </li>
            </ul>
          </div>
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
