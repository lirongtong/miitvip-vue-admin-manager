# 路由管理

> 「 路由管理 」 组件属于重型组件，即 一个组件 ≈ 一个页面，动态生成路由。

## 使用示例

### 默认

```html
<mi-apps-router />
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件
>
> ## API

### MiAppsRouter `<mi-apps-router>`

#### `MiAppsRouter` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `paginationLocale` | `object` | `{}` | Antdv Table 分页组件的 i18n 配置
| `data` | [`RouterTreeItem[]`](./README.md#routertreeitem-属性--properties-) | `[]` | 自定义路由数据 (首选, 次选 `getRouterAction`)
| `getRouterAction` | `string \| function` | `''` | 获取路由数据的接口地址或自定义方法
| `getRouterMethod` | `string` | `get` | 获取路由数据的接口的请求方式 ( `getRouterAction` string 时有效 )
| `getRouterParams` | `object` | `{}` | 获取路由数据的接口参数
| `createRouterAction` | `string \| function` | `''` | 新增路由数据的接口地址或自定义方法
| `createRouterMethod` | `string` | `post` | 新增路由数据的接口的请求方式 ( `createRouterAction` string 时有效 )
| `createRouterParams` | `object` | `{}` | 新增路由数据的接口参数
| `updateRouterAction` | `string \| function` | `''` | 更新路由数据的接口地址或自定义方法
| `updateRouterMethod` | `string` | `put` | 更新路由数据的接口的请求方式 ( `updateRouterAction` string 时有效 )
| `updateRouterParams` | `object` | `{}` | 更新路由数据的接口参数
| `deleteRouterAction` | `string \| function` | `''` | 删除路由数据的接口地址或自定义方法
| `deleteRouterMethod` | `string` | `delete` | 删除路由数据的接口的请求方式 ( `deleteRouterAction` string 时有效 )
| `deleteRouterParams` | `object` | `{}` | 删除路由数据的接口参数
| `checkRouterNameExistAction` | `string \| function` | `''` | 校验路由名称是否存在的接口地址或自定义方法
| `checkRouterNameExistMethod` | `string` | `get` | 校验路由名称是否存在的接口的请求方式 ( `getRouterAction` string 时有效 )
| `checkRouterNameExistParams` | `object` | `{}` | 校验路由名称是否存在的接口参数

#### `RouterTreeItem` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `id` | `string \| number` | `''` | 路由项唯一标识
| `pid` | `string \| number` | `''` | 父级路由项唯一标识
| `type` | `string \| number` | `''` | 路由项类型 ( 顶层路由 / 子路由 )
| `name` | `string` | `''` | 路由项名称 ( 唯一性 )
| `path` | `string` | `''` | 路由地址
| `page` | `string` | `''` | 路由组件名称
| `title` | `string` | `''` | 路由项显示名称
| `weight` | `number` | `1` | 权重 ( 值越大越靠前 )
| `children` | `RouterTreeItem[]` | `''` | 子路由项
