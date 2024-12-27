import primeVue from '@/plugins/prime-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/styles.scss'
import '@/assets/tailwind.css'
import { AxiosAdapter } from './gateways/HttpClient'
import { OrganizationGatewayHttp } from './gateways/OrganizationGateway'
import { ProjectGatewayHttp } from './gateways/ProjectGateway'
import { UserGatewayHttp } from './gateways/UserGateway'
import { WikiPageGatewayHttp } from './gateways/WikiPageGateway'
import { WorkItemGatewayHttp } from './gateways/WorkItemGateway'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(primeVue)
app.use(pinia)

const httpClient = new AxiosAdapter()
const userGateway = new UserGatewayHttp(httpClient)
const organizationGateway = new OrganizationGatewayHttp(httpClient)
const projectGateway = new ProjectGatewayHttp(httpClient)
const wikiPageGateway = new WikiPageGatewayHttp(httpClient)
const workItemGateway = new WorkItemGatewayHttp(httpClient)
app.provide('userGateway', userGateway)
app.provide('organizationGateway', organizationGateway)
app.provide('projectGateway', projectGateway)
app.provide('wikiPageGateway', wikiPageGateway)
app.provide('workItemGateway', workItemGateway)

app.mount('#app')
