import { createApp } from 'vue'
import router from './router'
import vuex from './store'
import icons from './icons'
import antd from './modules'
import App from './app.vue'
import 'makeit-admin/styles'
import MakeitAdmin from 'makeit-admin'

const app = createApp(App)
app.use(router).use(vuex).use(icons)
app.use(antd).use(MakeitAdmin).mount('#app')
