import { createApp } from 'vue'
import router from './router'
import App from './app.vue'
import { Layout, Code, Title, Quote, Modal, Captcha, Dropdown, Password, Login } from '../src/index'

const app = createApp(App)
app.use(router)

const components = [Layout, Code, Title, Quote, Modal, Captcha, Dropdown, Password, Login]
components.forEach((component) => app.use(component))

app.mount('#app')
