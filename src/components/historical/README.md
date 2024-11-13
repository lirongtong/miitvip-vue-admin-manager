# 历史路由

> 「 历史路由 」 组件根据页面路由切换，自动生成历史路由选单，方便历史路由导航。

## 使用示例

### 默认

```html
<template>
    <mi-historical-routing />
</template>
```

### 动画

```html
<template>
    <mi-historical-routing animation-name="scale" />
</template>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Historical Tokens

| Token | 默认值
| :---- | :----
| `--mi-historical-routing-bg` | `--mi-background`
| `--mi-historical-routing-text` | `--mi-on-background`
| `--mi-historical-routing-item-active-text` | `--mi-on-primary`
| `--mi-historical-routing-item-bg-active-start` | `--mi-primary`
| `--mi-historical-routing-item-bg-active-hint` | `--mi-secondary`
| `--mi-historical-routing-item-bg-active-stop` | `--mi-tertiary`

## API

### MiHistoricalRouting `<mi-historical-routing>`

#### `MiHistoricalRouting` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `animationName` | `string` | `'false'` | 动画名称
| `animationDuration` | `number` | `400` | 动画时长

### Interface `HistoricalRouting`

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `name` | string | `''` | 名称
| `title` | string | `''` | 标题
| `path` | string | `''` | 路由
