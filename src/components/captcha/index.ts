import { App } from 'vue'
import MiCaptcha from './captcha.vue'

const Captcha = {
    name: 'MiCaptcha',
    install: (app: App) => {
        app.component(Captcha.name, MiCaptcha)
    }
}
export default Captcha