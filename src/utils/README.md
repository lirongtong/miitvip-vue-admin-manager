### Interface `DeviceSize`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `laptop` | `string \| number` | 电脑端
| `mobile` | `string \| number` | 移动端
| `tablet` | `string \| number` | 平板端

### Interface `ResponseData`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `ret` | [`ResponseRet`](./README.md) | 结果信息 `result`
| `data` | `any` | 响应数据

### Interface `ResponseRet`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `code` | `string \| number` | 状态码
| `message` | `string` | 信息

### Interface `DropdownItem`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `name` | `string` | 用于 `key` 值生成
| `title` | `string` | 菜单项的标题
| `titleSize` | `string \| number \| DeviceSize` | 菜单项的标题的大小
| `path` | `string` | 链接地址
| `query` | `object` | 链接参数
| `target` | `string` | 链接的弹窗类型
| `icon` | `vSlot` | 图标
| `iconSize` | `string \| number \| DeviceSize` | 图标大小
| `tag` | `ItemTag` | 图标大小
| `callback` | `function` | 点击回调事件

### Interface `ItemTag`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `color` | `string` | 颜色
| `content` | `string` | 内容
| `icon` | `vSlot` | 图标
| `size` | `string \| number \| DeviceSize` | 大小
| `radius` | `string \| number \| DeviceSize` | 圆角弧度

### Interface `MenuItem`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `path` | `string` | 路由
| `name` | `string` | 名称 ( 唯一值 )
| `query` | `object` | 路由参数
| `meta` | [`MenuItemMeta`]('./README.md') | 其他配置
| `children` | `MenuItem[]` | 子菜单项

### Interface `MenuItemMeta`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `title` | `string` | 菜单项的标题
| `icon` | `vSlot` | 图标
| `tag` | `ItemTag` | 标签

### Interface `ThemeConfig`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `type` | `string` | 深浅主题 `['dark', 'light']`
| `primary` | `string` | 主题色
| `radius` | `number` | 圆角弧度

### Interface `ThemeToken` extends `ThemeConfig`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `components` | [`ComponentTokens`](./types.ts) | 主题 `Token` 配置

### Interface `Position`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `top` | `string \| number \| DeviceSize` | 上边距
| `right` | `string \| number \| DeviceSize` | 右边距
| `bottom` | `string \| number \| DeviceSize` | 下边距
| `left` | `string \| number \| DeviceSize` | 左边距
