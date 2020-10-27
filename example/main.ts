import { createApp } from 'vue'
import router from './router'
import vuex from './store'
import icons from './icons'
import antd from './modules'
import App from './app.vue'
import '../src/assets/styles/makeit.less'
import MakeitAdmin from '../src/index'

const app = createApp(App)
app.use(router).use(vuex).use(icons).use(antd).use(MakeitAdmin).mount('#app')
