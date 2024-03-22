# 面包屑导航

> 「 面包屑导航 」 组件根据 `route` 路由配置信息自动生成面包屑导航数据

## 使用示例

### 默认

```html
<mi-breadcrumb />
```

### 分隔符

```html
<mi-breadcrumb separator="~" />
```

### 动画

```html
<!-- 内置的动画效果请看 `components/_utils/props` - animations -->
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
