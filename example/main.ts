import { createApp } from 'vue'
import App from './app.vue'
import MakeitAdmin from '../src/index'

const app = createApp(App)
app.use(MakeitAdmin).mount('#app')
