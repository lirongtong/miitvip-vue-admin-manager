/*
 * +-------------------------------------------+
 * |                  MIITVIP                  |
 * +-------------------------------------------+
 * | Copyright (c) 2020 makeit.vip             |
 * +-------------------------------------------+
 * | Author: makeit <lirongtong@hotmail.com>   |
 * | Homepage: https://www.makeit.vip          |
 * | Github: https://github.com/lirongtong     |
 * | Date: 2020-5-25 11:07                     |
 * +-------------------------------------------+
 */
import { App } from 'vue'
import config from './utils/config'
import cookie from './utils/cookie'
import storage from './utils/storage'
import http from './utils/http'
import tools from './utils/tools'
import MiLayout from './components/layout'

const components: {[index: string]: any} = {
    config, cookie, storage, http, tools,
    MiLayout
}
const install = (app: App) => {
    Object.keys(components).forEach((name) => {
        app.use(components[name])
    })
}

export default class MakeitAdmin {
    static install: (app: App) => void
    static version: string
    constructor() {}
}
MakeitAdmin.install = install
MakeitAdmin.version = `${process.env.VERSION}`