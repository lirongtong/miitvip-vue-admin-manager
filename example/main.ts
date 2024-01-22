import { createApp } from 'vue'
import router from './router'
import App from './app.vue'
import { Layout, Notice } from '../src/index'

const app = createApp(App)
app.use(router)
const components = [Layout, Notice]
components.forEach((component) => app.use(component))
app.mount('#app')
