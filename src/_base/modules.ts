import config from '/@src/utils/config'
import cookie from '/@src/utils/cookie'
import storage from '/@src/utils/storage'
import api from '/@src/utils/api'
import http from '/@src/utils/http'
import tools from '/@src/utils/tools'

import MiLayout from '/@src/components/layout'
import MiCaptcha from '/@src/components/captcha'

const makeit: {[index: string]: any} = {
    config, cookie, storage, api, http, tools,
    MiLayout, MiCaptcha
}
export default makeit