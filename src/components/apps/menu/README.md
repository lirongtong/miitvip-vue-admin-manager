# 菜单管理（MiAppsMenu）

> 「 菜单管理 」组件用于统一管理站点导航菜单，支持本地数据渲染与远程接口增删改查。

## 使用示例

> 各个管理动作既可以通过 `string` 形式的接口地址完成，也可以通过自定义 `function` 完全接管请求过程。

### 默认（本地数据）

```html
<template>
    <mi-apps-menu :data="menus" />
</template>

<script setup lang="ts">
import type { MenuTreeItem } from './props'

const menus: Partial<MenuTreeItem>[] = [
    {
        id: 1,
        pid: 0,
        type: 1,
        name: 'dashboard',
        title: '仪表盘',
        path: '/dashboard',
        page: 'dashboard',
        icon: 'DashboardOutlined',
        weight: 1,
        lang: 'dashboard',
        children: []
    }
]
</script>
```

### 通过接口管理菜单

```html
<mi-apps-menu
    get-menus-action="/v1/menus"
    create-menus-action="/v1/menus"
    update-menus-action="/v1/menus"
    delete-menus-action="/v1/menus"
/>
```

### 自定义校验菜单名称是否存在

```html
<mi-apps-menu
    :check-name-exist-action="(params) => {
        // 返回字符串表示校验失败提示
        if (params.name === 'admin') return '菜单名称已存在'
        // 其他返回值 / Promise<void> 表示通过
        return true
    }"
/>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件。

## API

### MiAppsMenu `<mi-apps-menu>`

#### `MiAppsMenu` 属性 (Properties)

| 参数 | 类型 | 默认值 | 说明 |
| :---- | :---- | :---- | :---- |
| `paginationLocale` | `any` | `zhCN` | Ant Design Vue 分页组件多语言配置，默认跟随全局语言 |
| `data` | `Partial<MenuTreeItem>[]` | `[]` | 本地菜单树数据，存在且长度大于 0 时不会发起远程请求 |
| `getMenusAction` | `string \| function` | `''` | 获取菜单数据接口地址或自定义方法 |
| `getMenusMethod` | `string` | `get` | 获取菜单数据接口的请求方式（`getMenusAction` 为 `string` 时有效） |
| `getMenusParams` | `object` | `{}` | 获取菜单数据接口的额外参数 |
| `createMenusAction` | `string \| function` | `''` | 新增菜单接口地址或自定义方法 |
| `createMenusMethod` | `string` | `post` | 新增菜单接口的请求方式（`createMenusAction` 为 `string` 时有效） |
| `createMenusParams` | `object` | `{}` | 新增菜单接口的额外参数 |
| `updateMenusAction` | `string \| function` | `''` | 更新菜单接口地址或自定义方法 |
| `updateMenusMethod` | `string` | `put` | 更新菜单接口的请求方式（`updateMenusAction` 为 `string` 时有效） |
| `updateMenusParams` | `object` | `{}` | 更新菜单接口的额外参数 |
| `deleteMenusAction` | `string \| function` | `''` | 删除菜单接口地址或自定义方法（支持批量删除） |
| `deleteMenusMethod` | `string` | `delete` | 删除菜单接口的请求方式（`deleteMenusAction` 为 `string` 时有效） |
| `deleteMenusParams` | `object` | `{}` | 删除菜单接口的额外参数 |
| `checkNameExistAction` | `string \| function` | `''` | 校验菜单名称是否存在的接口地址或自定义方法 |
| `checkNameExistMethod` | `string` | `get` | 校验菜单名称是否存在的接口请求方式（`checkNameExistAction` 为 `string` 时有效） |
| `checkNameExistParams` | `object` | `{}` | 校验菜单名称是否存在的接口额外参数 |

### Interface `MenuTreeItem`

| 参数 | 类型 | 说明 |
| :---- | :---- | :---- |
| `id` | `string \| number` | 菜单项唯一标识 |
| `pid` | `string \| number` | 父级菜单项唯一标识 |
| `type` | `string \| number` | 菜单项类型（一级菜单 / 子菜单 / 按钮菜单） |
| `name` | `string` | 菜单项记录名称（英文，需唯一） |
| `path` | `string` | 路由地址 |
| `page` | `string` | 路由组件名称 |
| `title` | `string` | 菜单项显示名称 |
| `sub_title` | `string` | 菜单项副标题 |
| `value` | `string \| number` | 适配 Ant Design Vue Tree / Table 的值字段 |
| `icon` | `string \| number` | 图标名称（对应 `@ant-design/icons-vue` 中的组件名） |
| `weight` | `number` | 排序权重，数值越小越靠前 |
| `lang` | `string` | 语言标识，用于多语言菜单文案映射 |
| `children` | `Partial<MenuTreeItem>[]` | 子菜单项 |

### Interface `MenuTree`

| 参数 | 类型 | 说明 |
| :---- | :---- | :---- |
| `title` | `string` | 菜单显示名称 |
| `value` | `string \| number` | 菜单值（适配 Ant Design Vue TreeSelect） |
| `children` | `Partial<MenuTreeItem>[]` | 子菜单项 |

#### `MiAppsMenu` 事件 (Events)

| 方法 | 返回值 | 说明 |
| :---- | :---- | :---- |
| `afterGetMenus` | [`ResponseData`](../../utils/README.md) \| *None* | 通过接口获取菜单成功后的回调 |
| `afterCreateMenus` | [`ResponseData`](../../utils/README.md) \| *None* | 新增菜单成功后的回调 |
| `afterUpdateMenus` | [`ResponseData`](../../utils/README.md) \| *None* | 更新菜单成功后的回调 |
| `afterDeleteMenus` | [`ResponseData`](../../utils/README.md) \| *None* | 删除菜单成功后的回调 |
