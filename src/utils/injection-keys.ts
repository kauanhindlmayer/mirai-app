import type BoardGateway from '@/gateways/BoardGateway'
import type OrganizationGateway from '@/gateways/OrganizationGateway'
import type ProjectGateway from '@/gateways/ProjectGateway'
import type UserGateway from '@/gateways/UserGateway'
import type WikiPageGateway from '@/gateways/WikiPageGateway'
import type WorkItemGateway from '@/gateways/WorkItemGateway'
import type { InjectionKey } from 'vue'

export const userGatewayKey = Symbol() as InjectionKey<UserGateway>
export const organizationGatewayKey = Symbol() as InjectionKey<OrganizationGateway>
export const projectGatewayKey = Symbol() as InjectionKey<ProjectGateway>
export const wikiPageGatewayKey = Symbol() as InjectionKey<WikiPageGateway>
export const workItemGatewayKey = Symbol() as InjectionKey<WorkItemGateway>
export const boardGatewayKey = Symbol() as InjectionKey<BoardGateway>
