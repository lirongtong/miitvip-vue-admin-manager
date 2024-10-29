<template>
    <mi-theme>
        <mi-layout />
    </mi-theme>
</template>

<script lang="ts" setup>
import { createVNode } from 'vue'
import * as AntdvIcons from '@ant-design/icons-vue'
import { useStoreMenu, useStoreSearch, type MenuTreeItem, type MenuItem, useTools } from '../../src/index'
import { useI18n } from 'vue-i18n'
import { useRouter, type RouteRecordRaw } from 'vue-router'
import { searchData } from '../assets/data/search'
import { menusData } from '../assets/data/menus'

const { t, te } = useI18n()
const router = useRouter()
const { $tools } = useTools()
const homeComponent = () => import('../views/home.vue')
router.addRoute({
    path: '/',
    meta: { title: '首页' },
    component: homeComponent
})
const menuStore = useStoreMenu()
menuStore.updateMenus(menusData)

const getMenusTreeData = (data: any): MenuTreeItem[] => {
    const top = [] as MenuTreeItem[]
    for (let i = 0, l = data.length; i < l; i++) {
        const cur = data[i]
        const temp = {
            ...cur,
            key: cur.id,
            title: cur.name,
            value: cur.id
        } as MenuTreeItem
        if (cur.children) temp.children = getMenusTreeData(cur.children)
        top.push(temp)
    }
    return top
}

const createRouters = (data?: Partial<MenuTreeItem>[]) => {
    const navs: MenuItem[] = []
    const names: string[] = []
    ;(data || [])?.forEach((child: Partial<MenuTreeItem>) => {
        const page = `..` + $tools.startWith(child?.page, '/') as string
        const path = $tools.startWith(child?.path, '/') as string
        const paths = path.split('/')
        paths.shift()
        const component = () => import(page)
        const name = paths.length > 0 ? paths.join('-') : child?.name
        const common = {
            path,
            name: names.includes(name) ? $tools.uid() : name
        }
        const commonMeta = {
            title: te(child?.lang) ? t(child?.lang) : child?.title || child?.name,
            auth: parseInt(child?.auth_login) || false
        }
        const route = {
            ...common,
            meta: { ...commonMeta },
            redirect: child?.redirect || null
        } as RouteRecordRaw
        if (!route.redirect) route.component = component
        const nav = {
            ...common,
            meta: {
                ...commonMeta,
                subTitle: child?.sub_name ?? '',
                icon: child?.icon ? createVNode(AntdvIcons?.[child?.icon]) : null
            }
        } as MenuItem
        if (child?.children && child?.children.length > 0) {
            nav.children = createRouters(child?.children)
            navs.push(nav)
        } else {
            navs.push(nav)
            names.push(name)
            router.addRoute(route)
        }
    })
    return navs
}

const searchStore = useStoreSearch()
searchStore.updateData(searchData)
</script>