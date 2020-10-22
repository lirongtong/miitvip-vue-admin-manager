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
import cookie from './utils/cookie'
import storage from './utils/storage'
import MiLayout from './components/layout'

const components: {[index: string]: any} = {
    MiLayout
}
const install = (app: App) => {
    Object.keys(components).forEach((name) => {
        app.component(name, components[name])
    })
    app.use(cookie)
    app.use(storage)
}

export default class MakeitAdmin {
    static install: (app: App) => void
    static version: string
    constructor() {}
}
MakeitAdmin.install = install
MakeitAdmin.version = `${process.env.VERSION}`