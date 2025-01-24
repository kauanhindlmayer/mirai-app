import { BoardGatewayHttp } from '@/gateways/BoardGateway'
import { DashboardGatewayFake } from '@/gateways/DashboardGateway'
import { AxiosAdapter } from '@/gateways/HttpClient'
import { OrganizationGatewayHttp } from '@/gateways/OrganizationGateway'
import { ProjectGatewayHttp } from '@/gateways/ProjectGateway'
import { TagGatewayHttp } from '@/gateways/TagGateway'
import { TeamGatewayHttp } from '@/gateways/TeamGateway'
import { UserGatewayHttp } from '@/gateways/UserGateway'
import { WikiPageGatewayHttp } from '@/gateways/WikiPageGateway'
import { WorkItemGatewayHttp } from '@/gateways/WorkItemGateway'
import {
  boardGatewayKey,
  dashboardGatewayKey,
  organizationGatewayKey,
  projectGatewayKey,
  tagGatewayKey,
  teamGatewayKey,
  userGatewayKey,
  wikiPageGatewayKey,
  workItemGatewayKey,
} from '@/utils/injection-keys'
import type { App } from 'vue'

const httpClient = new AxiosAdapter()
const userGateway = new UserGatewayHttp(httpClient)
const organizationGateway = new OrganizationGatewayHttp(httpClient)
const projectGateway = new ProjectGatewayHttp(httpClient)
const wikiPageGateway = new WikiPageGatewayHttp(httpClient)
const workItemGateway = new WorkItemGatewayHttp(httpClient)
const boardGateway = new BoardGatewayHttp(httpClient)
const dashboardGateway = new DashboardGatewayFake()
const tagGateway = new TagGatewayHttp(httpClient)
const teamGateway = new TeamGatewayHttp(httpClient)

const gatewayRegistry = {
  install(app: App<Element>) {
    app.provide(userGatewayKey, userGateway)
    app.provide(organizationGatewayKey, organizationGateway)
    app.provide(projectGatewayKey, projectGateway)
    app.provide(wikiPageGatewayKey, wikiPageGateway)
    app.provide(workItemGatewayKey, workItemGateway)
    app.provide(boardGatewayKey, boardGateway)
    app.provide(dashboardGatewayKey, dashboardGateway)
    app.provide(tagGatewayKey, tagGateway)
    app.provide(teamGatewayKey, teamGateway)
  },
}

export default gatewayRegistry
