import config from './utils/config'
import cookie from './utils/cookie'
import storage from './utils/storage'
import api from './utils/api'
import http from './utils/http'
import tools from './utils/tools'

import MiLayout from '/@src/components/layout'
import MiCaptcha from '/@src/components/captcha'

const mip: {[index: string]: any} = {
    config, cookie, storage, api, http, tools,
    MiLayout, MiCaptcha
}
export default mip