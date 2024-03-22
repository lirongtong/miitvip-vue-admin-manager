# 锚点链接

> 「 锚点链接 」 组件默认收集页面内的 「 `h1 - h6` 」标签，自动形成锚点（默认）悬浮在右侧

## 使用示例

### 默认

```html
<!-- 默认监听 document.body 的 scroll 事件 -->
<mi-anchor />
```

### 指定监听容器

```html
<template>
    <mi-anchor :listener-container="container" />
</template>

<script setup lang="ts">
    import { ref, onMounted, nextTick } from 'vue'

    const container = ref<HTMLElement | null>(null)
    onMounted(() => nextTick().then(() => container.value = document.getElement('mi-anchor-container')))
</script>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Anchor Tokens

| Token | 默认值
| :---- | :----
| `--mi-anchor-background-start` | `--mi-surface`
| `--mi-anchor-background-stop` | `--mi-surface-variant`
| `--mi-anchor-text` | `--mi-surface-variant`
| `--mi-anchor-border` | `--mi-primary`

#### AnchorLink Tokens

| Token | 默认值
| :---- | :----
| `--mi-anchor-link-text-default` | `--mi-on-surface`
| `--mi-anchor-link-text-active` | `--mi-primary`

## API

### MiAnchor `<mi-anchor>`

#### `MiAnchor` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `collectContainer` | `string` | `document` | 选择器 - 指定待收集的区域
| `listenerContainer` | `Window \| HTMLElement` | `document.body` | `scroll` 事件的监听容器
| `selector` | `string \| string[]` | `['h1', 'h2', 'h3', 'h4', 'h5', 'h6']` | 选择器 - 指定待收集的标签
| `requireAttr` | `string` | `''` | 收集的元素所必须要包含的指定属性
| `affix` | `boolean` | `false` | 默认是否固定悬浮
| `position` | [`Position`](../../utils/README.md) | `{ top: 200 }` | 定位
| `scrollOffset` | `number` | `80` | 滚动定位偏移量
| `reserveOffset` | `number` | `''` | 预留偏移量
| `delayInit` | `number` | `800` | 延迟初始化（避免渲染未完成，定位失败）
| `affixText` | `string` | `目录` | 悬浮状态显示的文案
| `duration` | `number` | `1000` | 滚动动画时长

#### `MiBacktop` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `click` | *None* | 锚点点击事件回调

### MiAnchorLink `<mi-anchor-link>`

#### `MiAnchorLink` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `id` | `string` | `$tools.uid()` | 定位 `id`
| `title` | `string` | `h` 标签的 `innerText` | 显示标题
| `active` | `boolean` | `false` | 是否选中

#### `MiAnchorLink` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `click` | *None* | 锚点点击事件回调
