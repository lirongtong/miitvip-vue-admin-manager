import { createApp } from 'vue'
import router from './router'
import antd from './modules'
import App from './app.vue'
import '../src/assets/styles/makeit.less'
import MakeitAdmin from '../src/index'

const app = createApp(App)
app.use(router).use(antd).use(MakeitAdmin).mount('#app')
