import type { App, Plugin } from 'vue'
import Mixins from '../../utils/mixins'
import Search from './Search'

Search.install = (app: App) => {
    Mixins(app)
    if (typeof app.component(Search.name) === 'undefined') {
        app.component(Search.name, Search)
        app.component(Search.Key.name, Search.Key)
    }
    return app
}

export default Search as typeof Search & Plugin
