import { createApp } from 'vue'
import router from './router'
import icons from './icons'
import antd from './modules'
import App from './app.vue'
import '../src/assets/styles/makeit.less'
import MakeitAdmin from '../src/index'

const app = createApp(App)
app.use(router).use(icons).use(antd).use(MakeitAdmin).mount('#app')
