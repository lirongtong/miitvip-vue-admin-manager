# 基础布局

> 「 基础布局 」组件主体设计
>
> 「 `Header` 」顶部布局，内置在 「 `Content` 」顶部，放置面包屑，搜索等全局通用模块
>
> 「 `Sider` 」侧边栏位，展开宽度「 `256px` 」，收起宽度「 `80px` 」，用于放置站点图标及菜单导航等选项
>
> 「 `Content` 」内容布局，自定义内容区域
>
> 「 `Footer` 」底部布局，放置版权，友链等内容

## 使用示例

### 默认

```html
<mi-layout />
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Layout Tokens

| Token | 默认值
| :---- | :----
| `--mi-layout-background` | `rgba(--mi-rgb-surface-variant, .6)`

#### Layout Content Tokens

| Token | 默认值
| :---- | :----
| `--mi-layout-content-text` | `--mi-on-background`
| `--mi-layout-content-mask` | `--mi-shadow`
| `--mi-layout-content-shadow` | `--mi-shadow`
| `--mi-layout-content-background` | `--mi-background`

#### Layout Sider Logo Tokens

| Token | 默认值
| :---- | :----
| `--mi-layout-sider-logo-text` | `--mi-primary`
| `--mi-layout-sider-logo-border` | `--mi-primary`
| `--mi-layout-sider-logo-collapsed` | `--mi-on-background`
| `--mi-layout-sider-logo-notice` | `--mi-on-background`
| `--mi-layout-sider-logo-trigger` | `rgba(--mi-rgb-on-surface, .1)`

## API

### MiLayout `<mi-layout>`

#### `MiLayout` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `showBreadcrumbs` | `boolean` | `true` | 是否显示面包屑导航
| `header` | `vSlot` | `''` | 顶栏
| `sider` | `vSlot` | `''` | 侧边栏
| `footer` | `vSlot` | `''` | 页脚
| `headerSetting` | `LayoutHeaderProperties` | `{}` | `Layout Header` 配置
| `siderSetting` | `LayoutSiderProperties` | `{}` | `Layout Sider` 配置
| `contentSetting` | `LayoutContentProperties` | `{}` | `Layout Content` 配置

### MiLayoutHeader `<mi-layout-header>`

#### `MiLayoutHeader` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `notice` | `vSlot` | `''` | 消息配置
| `dropdown` | `vSlot` | `''` | 下拉菜单配置
| `breadcrumb` | `vSlot` | `''` | 面包屑配置
| `search` | `vSlot` | `''` | 搜索配置
| `breadcrumbSetting` | [`BreadcrumbProperties`](../breadcrumb/README.md) | `{}` | 面包屑组件属性配置
| `searchSetting` | [`SearchProperties`](../search/README.md) | `{}` | 搜索组件属性配置
| `palette` | `vSlot` | `''` | 调色板
| `extra` | `vSlot` | `''` | 额外的自定义配置

### MiLayoutSider `<mi-layout-sider>`

#### `MiLayoutSider` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `logo` | `vSlot` | `''` | 图标
| `menu` | `vSlot` | `''` | 菜单
| `background` | `vSlot` | `''` | 背景色
| `logoSetting` | `LayoutSiderLogoProperties` | `{}` | `Logo` 组件属性配置

### MiLayoutSiderLogo `<mi-layout-sider-logo>`

#### `MiLayoutSiderLogo` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `circle` | `boolean` | `true` | 圆形显示 LOGO
| `collapsed` | `vSlot` | `<MenuFoldOutlined />` | 展开/收起按钮配置
| `notice` | `vSlot` | `''` | 消息配置
| `noticeSetting` | [`NoticeProperties`](../notice/README.md) | `{}` | 消息组件属性配置
| `showAction` | `boolean` | `true` | 是否显示 `Notice` 组件与 `Collapsed` 展开/收起按钮

### MiLayoutContent `<mi-layout-content>`

#### `MiLayoutContent` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `animation` | `string` | `page-slide` | 切换动画
| `footer` | `vSlot` | `<MiLayoutFooter />` | 页脚配置
| `showBacktop` | `boolean` | `true` | 是否显示回到顶部
| `backtopSetting` | [`BacktopProperties`](../backtop/README.md) | `{}` | 回到顶部配置
| `showAnchor` | `boolean` | `true` | 是否显示锚点
| `anchorSetting` | [`AnchorProperties`](../anchor/README.md) | `{}` | 锚点链接配置
