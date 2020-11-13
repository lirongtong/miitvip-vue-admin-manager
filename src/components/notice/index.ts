import { App, Plugin } from 'vue'
import MiNotice from './notice'

MiNotice.install = (app: App) => {
    app.component(MiNotice.name, MiNotice)
    app.component(MiNotice.Tab.name, MiNotice.Tab)
    app.component(MiNotice.Item.name, MiNotice.Item)
}

export default MiNotice as typeof MiNotice & Plugin