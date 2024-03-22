# 回到顶部

> 「 回到顶部 」 组件用于在当前位置快速回到顶部

## 使用示例

### 默认

```html
<!-- 默认监听 document.body 的 scroll 事件 -->
<mi-backtop />
```

### 指定监听容器

```html
<template>
    <mi-backtop :listener-container="container" />
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
| `icon` | `vSlot` | `<RocketOutlined />` | 图标
| `listenerContainer` | `Window \| HTMLElement` | `document.body` | `scroll` 事件的监听容器

#### `MiBacktop` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `end` | *None* | 回到顶部后的事件回调
