import { createApp } from 'vue'
import router from './router'
import App from './app.vue'
import { Layout } from '../src/index'

const app = createApp(App)
app.use(router)
app.use(Layout)
app.mount('#app')
