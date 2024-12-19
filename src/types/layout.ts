/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import type { Project } from '@/types'

export type LayoutConfig = {
  preset: Preset
  primary: Primary
  surface?: Surface
  isDarkTheme: boolean
  menuMode: MenuMode
  menuTheme: MenuTheme
  cardStyle: CardStyle
}

export enum Preset {
  Aura = 'Aura',
  Lara = 'Lara',
  Nora = 'Nora',
}

export enum Primary {
  Emerald = 'emerald',
  Green = 'green',
  Lime = 'lime',
  Orange = 'orange',
  Amber = 'amber',
  Yellow = 'yellow',
  Teal = 'teal',
  Cyan = 'cyan',
  Sky = 'sky',
  Blue = 'blue',
  Indigo = 'indigo',
  Violet = 'violet',
  Purple = 'purple',
  Fuchsia = 'fuchsia',
  Pink = 'pink',
  Rose = 'rose',
}

export enum Surface {
  Slate = 'slate',
  Gray = 'gray',
  Zinc = 'zinc',
  Neutral = 'neutral',
  Stone = 'stone',
  Soho = 'soho',
  Viva = 'viva',
  Ocean = 'ocean',
}

export enum MenuMode {
  Drawer = 'drawer',
  Overlay = 'overlay',
  Static = 'static',
  Horizontal = 'horizontal',
  Slim = 'slim',
  Compact = 'compact',
  Reveal = 'reveal',
}

export enum MenuTheme {
  Light = 'light',
  Dark = 'dark',
}

export enum CardStyle {
  Transparent = 'transparent',
  Filled = 'filled',
}

export type LayoutState = {
  staticMenuDesktopInactive: boolean
  overlayMenuActive: boolean
  rightMenuVisible: boolean
  configSidebarVisible: boolean
  staticMenuMobileActive: boolean
  menuHoverActive: boolean
  searchBarActive: boolean
  sidebarActive: boolean
  anchored: boolean
  activeMenuItem: string | null
  overlaySubmenuActive: boolean
}

export type MenuItem = {
  label?: string
  icon?: string
  to?: string
  items?: MenuItem[]
  separator?: boolean
  visible?: boolean
  class?: string
  url?: string
  target?: string
  disabled?: boolean
  command?: Function
}

export type Color = {
  name: string
  palette: Record<number, string>
}

export enum ColorType {
  Primary = 'primary',
  Surface = 'surface',
}

export type Breadcrumb = {
  label: string
  route: string
}

export type BreadcrumbResolver = (project: Project) => Breadcrumb[]
