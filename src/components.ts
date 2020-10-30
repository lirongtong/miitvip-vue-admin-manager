import config from './utils/config'
import cookie from './utils/cookie'
import storage from './utils/storage'
import api from './utils/api'
import http from './utils/http'
import tools from './utils/tools'

import MiLayout from './components/layout'
import MiCaptcha from './components/captcha'

const components: {[index: string]: any} = {
    config, cookie, storage, api, http, tools,
    MiLayout, MiCaptcha
}
export default components