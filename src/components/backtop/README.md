# 回到顶部（MiBacktop）

> 「回到顶部」组件用于在长页面中快速返回顶部，支持监听指定滚动容器、定制尺寸/位置/样式等。

## 使用示例

### 默认

```html
<!-- 默认监听 document.body 的 scroll 事件，当滚动高度超过 offset 时出现按钮 -->
<mi-backtop />
```

### 指定监听容器

```html
<template>
    <div ref="scrollContainer" class="content-wrapper">
        <!-- 页面内容 -->
        <mi-backtop :listener-container="scrollContainer" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scrollContainer = ref<HTMLElement | null>(null)
</script>
```

### 自定义尺寸、位置与提示文案

```html
<mi-backtop
    :width="56"
    :height="56"
    :radius="28"
    :offset="300"
    tip="返回顶部"
    :position="{ bottom: 80, right: 40 }"
/>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Backtop Tokens

| Token | 默认值
| :---- | :----
| `--mi-backtop-background-start` | `--mi-primary`
| `--mi-backtop-background-hint` | `--mi-secondary`
| `--mi-backtop-background-stop` | `--mi-tertiary`
| `--mi-backtop-icon` | `--mi-on-secondary`

## API

### MiBacktop `<mi-backtop>`

#### `MiBacktop` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `width` | `number \| string \|` [`DeviceSize`](../../utils/README.md) | `48` | 宽度
| `height` | `number \| string \|` [`DeviceSize`](../../utils/README.md) | `48` | 高度
| `radius` | `number \| string \|` [`DeviceSize`](../../utils/README.md) | `48` | 圆角弧度
| `offset` | `number` | `200` | 触发偏移量
| `duration` | `number` | `1000` | 滚动时长
| `tip` | `string` | `回到顶部` | 提示语 ( 移动端无效 )
| `zIndex` | `number` | `Date.now()` | 容器层级
| `position` | [`Position`](../../utils/README.md) | `{ bottom: 40, right: 40 }` | 容器定位
| `background` | `string` | `''` | 背景色
| `icon` | `vSlot` | `<RocketOutlined />` | 图标
| `listenerContainer` | `Window \| HTMLElement` | `document.body` | `scroll` 事件的监听容器

#### `MiBacktop` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `end` | *None* | 回到顶部后的事件回调
