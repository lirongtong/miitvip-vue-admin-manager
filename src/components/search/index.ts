import { App, Plugin } from 'vue'
import Search from './search'

Search.install = function (app: App) {
    app.component(Search.name, Search)
    app.component(Search.Key.name, Search.Key)
    return app
}

export default Search as typeof Search & Plugin
