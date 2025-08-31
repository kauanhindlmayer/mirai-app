<script setup lang="ts">
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const {
  isDarkTheme,
  onMenuToggle,
  onConfigSidebarToggle,
  onKeyboardShortcutsSidebarToggle,
  onProfileSidebarToggle,
  onSearchBarToggle,
} = useLayout()

const tabs = [
  {
    id: '0',
    label: 'Work Items',
    disabled: false,
  },
  {
    id: '1',
    label: 'Pull Requests',
    disabled: true,
  },
  {
    id: '2',
    label: 'Favorites',
    disabled: true,
  },
]

const selectedTab = ref(tabs[0].id)

function redirectToDocs() {
  window.open('https://miraihq.com/en', '_blank')
}

function contactSupport() {
  window.open('mailto:support@miraihq.com', '_blank')
}

function logout() {
  userStore.logout()
}
</script>

<template>
  <div class="layout-topbar">
    <div class="topbar-left">
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
          <a class="right-sidebar-button" @click="onSearchBarToggle">
            <i class="pi pi-search" />
          </a>
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
            <i class="pi pi-list-check" />
          </a>
          <div
            class="list-none m-0 rounded-lg border border-surface absolute bg-surface-0 dark:bg-surface-900 overflow-hidden hidden origin-top min-w-72 sm:w-[22rem] mt-2 right-0 z-50 top-auto shadow-[0px_56px_16px_0px_rgba(0,0,0,0.00),0px_36px_14px_0px_rgba(0,0,0,0.01),0px_20px_12px_0px_rgba(0,0,0,0.02),0px_9px_9px_0px_rgba(0,0,0,0.03),0px_2px_5px_0px_rgba(0,0,0,0.04)]"
          >
            <div class="flex items-center border-b border-surface">
              <button
                v-for="(tab, index) of tabs"
                :key="index"
                @click="selectedTab = tab.id"
                :class="[
                  selectedTab === tab.id
                    ? 'border-surface-950 dark:border-surface-0'
                    : 'border-transparent',
                  tab.disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : '',
                ]"
                class="px-3.5 py-2 inline-flex items-center border-b gap-2"
              >
                <span
                  :class="selectedTab === tab.id ? 'text-surface-950 dark:text-surface-0' : ''"
                  class="label-small"
                >
                  {{ tab.label }}
                </span>
              </button>
            </div>
            <ul
              class="flex flex-col divide-y divide-[var(--surface-border)] max-h-80 overflow-auto"
            >
              <li class="flex justify-center items-center py-4 text-center text-gray-600">
                <span>No Work Items Found</span>
              </li>
            </ul>
          </div>
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
            <i class="pi pi-question-circle" />
          </a>
          <div
            class="list-none p-2 m-0 rounded-lg border border-surface overflow-hidden absolute bg-surface-0 dark:bg-surface-900 hidden origin-top w-52 mt-2 right-0 z-999 top-auto shadow-[0px_56px_16px_0px_rgba(0,0,0,0.00),0px_36px_14px_0px_rgba(0,0,0,0.01),0px_20px_12px_0px_rgba(0,0,0,0.02),0px_9px_9px_0px_rgba(0,0,0,0.03),0px_2px_5px_0px_rgba(0,0,0,0.04)]"
          >
            <ul class="flex flex-col gap-1">
              <li>
                <a
                  class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                  @click="redirectToDocs"
                >
                  <i class="pi pi-external-link" />
                  <span>Get Started</span>
                </a>
              </li>
              <li>
                <a
                  class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                  @click="onKeyboardShortcutsSidebarToggle"
                >
                  <i class="pi pi-info-circle" />
                  <span>Keyboard Shortcuts</span>
                </a>
              </li>
              <li>
                <a
                  class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                  @click="contactSupport"
                >
                  <i class="pi pi-envelope" />
                  <span>Contact Support</span>
                </a>
              </li>
              <li>
                <a
                  class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center opacity-50 pointer-events-none cursor-not-allowed"
                >
                  <i class="pi pi-lock" />
                  <span>Privacy Policy</span>
                </a>
              </li>
            </ul>
          </div>
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
            <i class="pi pi-cog" />
          </a>
          <div
            class="list-none p-2 m-0 rounded-lg border border-surface overflow-hidden absolute bg-surface-0 dark:bg-surface-900 hidden origin-top w-52 mt-2 right-0 z-999 top-auto shadow-[0px_56px_16px_0px_rgba(0,0,0,0.00),0px_36px_14px_0px_rgba(0,0,0,0.01),0px_20px_12px_0px_rgba(0,0,0,0.02),0px_9px_9px_0px_rgba(0,0,0,0.03),0px_2px_5px_0px_rgba(0,0,0,0.04)]"
          >
            <ul class="flex flex-col gap-1">
              <li>
                <a
                  class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                  @click="onProfileSidebarToggle"
                >
                  <i class="pi pi-user" />
                  <span>Profile</span>
                </a>
              </li>
              <li>
                <a
                  class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center opacity-50 pointer-events-none cursor-not-allowed"
                >
                  <i class="pi pi-clock" />
                  <span>Time and Locale</span>
                </a>
              </li>
              <li>
                <a
                  class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                  @click="onConfigSidebarToggle"
                >
                  <i class="pi pi-palette" />
                  <span>Theme</span>
                </a>
              </li>
            </ul>
          </div>
        </li>

        <li class="profile-item static sm:relative">
          <a
            class="bg-none! border-none! outline-hidden!"
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
              pt:image:class="rounded-lg!"
              class="w-10! h-10!"
            />
          </a>
          <div
            class="list-none p-2 m-0 rounded-lg border border-surface overflow-hidden absolute bg-surface-0 dark:bg-surface-900 hidden origin-top mt-2 right-0 z-999 top-auto shadow-[0px_56px_16px_0px_rgba(0,0,0,0.00),0px_36px_14px_0px_rgba(0,0,0,0.01),0px_20px_12px_0px_rgba(0,0,0,0.02),0px_9px_9px_0px_rgba(0,0,0,0.03),0px_2px_5px_0px_rgba(0,0,0,0.04)]"
          >
            <div class="flex items-center gap-3 p-4">
              <Avatar
                :image="user?.imageUrl || undefined"
                :icon="user?.imageUrl ? undefined : 'pi pi-user'"
                size="xlarge"
                pt:image:class="rounded-lg!"
              />
              <div class="flex flex-col">
                <span class="text-lg font-semibold text-surface-900 dark:text-surface-0">
                  {{ user?.fullName }}
                </span>
                <span class="text-surface-600 dark:text-surface-200 text-sm">
                  {{ user?.email }}
                </span>
              </div>
            </div>
            <ul class="flex flex-col gap-1">
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
