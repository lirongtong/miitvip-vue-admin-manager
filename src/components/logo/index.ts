import { App, Plugin } from 'vue'
import Logo from './logo'

Logo.install = (app: App) => {
    app.component(Logo.name, Logo)
    return app
}

export default Logo as typeof Logo & Plugin
