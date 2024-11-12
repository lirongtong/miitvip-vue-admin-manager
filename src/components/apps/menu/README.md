# 菜单管理

> 「 菜单管理 」 组件统一管理站点导航，。

## 使用示例

> 各个管理动作支持「 string 」直接获取 API 数据或自定义 「 function 」设定相关数据。

### 默认

```html
<mi-apps-menu />
```

### 动作

```html
<mi-apps-menu get-menus-action="/v1/menus"
    create-menus-action="/v1/menus"
    update-menus-action="/v1/menus"
    delete-menus-action="/v1/menus" />
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

## API

### MiAppsMenu `<mi-apps-menu>`

#### `MiAppsMenu` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `getMenusAction` | `string \| function` | `''` | 获取菜单数据接口地址或自定义方法
| `getMenusMethod` | `string` | `get` | 获取菜单数据接口的请求方式 ( `getMenusAction` string 时有效 )
| `getMenusParams` | `object` | `{}` | 获取菜单数据接口参数
| `createMenusAction` | `string \| function` | `''` | 创建菜单数据接口地址或自定义方法
| `createMenusMethod` | `string` | `post` | 创建菜单数据接口的请求方式 ( `createMenusAction` string 时有效 )
| `createMenusParams` | `object` | `{}` | 创建菜单数据接口参数
| `updateMenusAction` | `string \| function` | `''` | 更新菜单数据接口地址或自定义方法
| `updateMenusMethod` | `string` | `put` | 更新菜单数据接口的请求方式 ( `updateMenusAction` string 时有效 )
| `updateMenusParams` | `object` | `{}` | 更新菜单数据接口参数
| `deleteMenusAction` | `string \| function` | `''` | 删除菜单数据接口地址或自定义方法
| `deleteMenusMethod` | `string` | `delete` | 删除菜单数据接口的请求方式 ( `deleteMenusAction` string 时有效 )
| `deleteMenusParams` | `object` | `{}` | 删除菜单数据接口参数
| `checkNameExistAction` | `string \| function` | `''` | 校验菜单名称是否存在的接口地址或自定义方法
| `checkNameExistMethod` | `string` | `delete` | 校验菜单名称是否存在的接口请求方式 ( `checkNameExistAction` string 时有效 )
| `checkNameExistParams` | `object` | `{}` | 校验菜单名称是否存在的接口参数

### Interface `MenuTreeItem`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `id` | `string \| number` | 菜单项唯一标识
| `pid` | `string \| number` | 父级菜单项唯一标识
| `type` | `number \| number` | 菜单项类型 ( 一级菜单 / 子菜单 / 按钮菜单 )
| `name` | `string` | 菜单项记录名称 ( 英文 )
| `path` | `string` | 路由地址
| `page` | `string` | 路由组件名称
| `title` | `string \| number` | 菜单项显示名称
| `value` | `string \| number` | 菜单项唯一标识 ( 中文 )
| `cid` | `string \| number` | 菜单项所属应用ID
| `icon` | `string \| number` | 图标名称
| `weight` | `number` | 权重
| `lang` | `string` | 语言标识
| `children` | `Partial<MenuTreeItem>[]` | 子菜单项

### Interface `MenuTree`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `title` | `string \| number` | 菜单显示名称
| `value` | `string \| number` | 菜单值
| `children` | `Partial<MenuTreeItem>[]` | 子菜单项

#### `MiAppsMenu` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `afterGetMenus` | [`ResponseData`](../../utils/README.md) \| *None*  | 获取菜单 - 成功后的回调
| `afterCreateMenus` | [`ResponseData`](../../utils/README.md) \| *None* | 创建菜单 - 成功后的回调
| `afterUpdateMenus` | [`ResponseData`](../../utils/README.md) \| *None* | 更新菜单 - 成功后的回调
| `afterDeleteMenus` | [`ResponseData`](../../utils/README.md) \| *None* | 删除菜单 - 成功后的回调
