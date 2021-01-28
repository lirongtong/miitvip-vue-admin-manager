import { App, Plugin } from 'vue'
import MiNotice from './notice'
import MiNoticeTab from './tab'
import MiNoticeItem from './item'

MiNotice.Tab = MiNoticeTab
MiNotice.Item = MiNoticeItem
MiNotice.install = (app: App) => {
    app.component(MiNotice.name, MiNotice)
    app.component(MiNotice.Tab.name, MiNotice.Tab)
    app.component(MiNotice.Item.name, MiNotice.Item)
    return app
}

export default MiNotice as typeof MiNotice &
    Plugin & {
        readonly Tab: typeof MiNoticeTab
        readonly Item: typeof MiNoticeItem
    }
