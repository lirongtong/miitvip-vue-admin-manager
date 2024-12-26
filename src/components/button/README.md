# 按钮组件

> 「 按钮组件 」基础作用用于触发一个操作，如提交表单或执行命令。此处封装的按钮组件，主要针对按钮增加箭头动画效果，增强按钮的互动性。

## 使用示例

### 默认效果

```vue
<template>
    <!-- 默认圆形按钮 -->
    <mi-button />
</template>
```

### 按钮文案

```vue
<template>
    <!-- 基础文案内容 -->
    <mi-button text="Hello World" />

    <!-- 复杂文案配置 -->
    <mi-button :text="{ text: 'Hello World', size: 16, color: 'red' }" />
</template>
```

### 方形按钮

```vue
<template>
    <mi-button :circle="false" />
</template>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

## API

### MiButton `<mi-button>`

#### `MiButton` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `width` | `number \| string \|` [`DeviceSize`](../../utils/README.md#interface-devicesize) | `''` | 宽度
| `height` | `number \| string \|` [`DeviceSize`](../../utils/README.md#interface-devicesize) | `''` | 高度
| `text` | `string \|` [`TextSetting`](../../utils/README.md#interface-textsetting) | `''` | 文案配置
| `link` | `string` | `''` | 链接地址
| `target` | `_blank \| _self` | `_self` | 链接打开方式
| `query` | `object` | `{}` | 链接参数配置
| `circle` | `boolean` | `true` | 圆形按钮
| `background` | `string` | `''` | 背景颜色
| `background` | `string` | `blur(1rem)` | 背景过滤
| `arrow` | [`ButtonArrow`](./README.md#interface-buttonarrow) | `{}` | 箭头配置
| `radius` | `number \| string \|` [`DeviceSize`](../../utils/README.md#interface-devicesize) | `''` | 圆角
| `borderColor` | `string` | `rgba(var(--mi-rgb-primary), 0.5)` | 边框颜色

### Interface `ButtonArrow`

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `direction` | `'up' \| 'down' \| 'right' \| 'left'` | `right` | 箭头方向 ( & 动画方向 )
| `delay` | `number` | `0` | 动画执行延迟时长 ( 秒 )
| `immediate` | `boolean` | `false` | 初始化组件后是否立即执行箭头动画
| `color` | `string` | `''` | 箭头颜色
