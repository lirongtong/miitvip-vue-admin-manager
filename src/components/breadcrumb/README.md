# 面包屑导航（MiBreadcrumb）

> 「面包屑导航」组件会根据路由配置自动生成当前位置的路径导航，支持自定义分隔符和切换动画效果。

## 使用示例

### 默认

```html
<!-- 自动读取当前路由信息并生成面包屑 -->
<mi-breadcrumb />
```

### 自定义分隔符

```html
<mi-breadcrumb separator="~" />
```

### 启用动画效果

```html
<!-- 内置动画名称请查看 `components/_utils/props` 中的 animations 列表 -->
<mi-breadcrumb animation="scale" />
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Breadcrumbs Tokens

| Token | 默认值
| :---- | :----
| `--mi-breadcrumb-text-default` | `--mi-on-surface-variant`
| `--mi-breadcrumb-text-active` | `--mi-primary`
| `--mi-breadcrumb-separator` | `--mi-on-surface-variant`

## API

### MiBreadcrumb `<mi-breadcrumb>`

#### `MiBreadcrumb` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `separator` | `string` | `/` | 分隔符
| `animation` | `string` | `breadcrumb` | 动画效果
