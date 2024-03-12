import { createApp } from 'vue'
import router from './router'
import App from './app.vue'
import { Layout, Code } from '../src/index'

const app = createApp(App)
app.use(router)

const components = [Layout, Code]
components.forEach((component) => app.use(component))

app.mount('#app')
