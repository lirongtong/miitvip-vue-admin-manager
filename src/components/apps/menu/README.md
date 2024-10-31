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
