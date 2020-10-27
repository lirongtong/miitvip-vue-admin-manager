import config from './utils/config'
import cookie from './utils/cookie'
import storage from './utils/storage'
import api from './utils/api'
import http from './utils/http'
import tools from './utils/tools'

import MiLayout from './components/layout'
import MiLayoutSider from './components/sider'
import MiLayoutSiderLogo from './components/logo'
import MiLayoutSiderMenu from './components/menu'
import MiLayoutHeader from './components/header'
import MiLayoutContent from './components/content'
import MiLayoutFooter from './components/footer'
import MiCaptcha from './components/captcha'

const components: {[index: string]: any} = {
    config, cookie, storage, api, http, tools,
    MiLayout, MiLayoutSider, MiLayoutSiderLogo, MiLayoutSiderMenu, 
    MiLayoutHeader, MiLayoutFooter, MiLayoutContent, MiCaptcha
}
export default components