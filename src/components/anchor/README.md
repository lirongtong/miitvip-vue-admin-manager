# 锚点链接（MiAnchor）

> 「锚点链接」组件用于在页面右侧展示一个浮动目录，默认自动收集页面内的 `h1 - h6` 标题并生成锚点，实现快速跳转与当前位置高亮。

## 使用示例

### 默认

```html
<!-- 默认监听 document.body 的 scroll 事件，自动收集页面内 h1 - h6 标题 -->
<mi-anchor />
```

### 指定滚动监听容器

```html
<template>
    <div ref="scrollContainer" class="content-wrapper">
        <!-- 页面内容 -->
        <mi-anchor :listener-container="scrollContainer" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scrollContainer = ref<HTMLElement | null>(null)
</script>
```

### 指定收集区域和标题选择器

```html
<mi-anchor
    collect-container="#article-body"
    :selector="['h2', 'h3']"
    require-attr="id"
/>
```

### 固定悬浮并自定义文案

```html
<mi-anchor
    :affix="true"
    affix-text="目录"
    :position="{ top: 200, right: 40 }"
    :scroll-offset="80"
/>
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

### 组件：`<mi-anchor>` / `MiAnchor`

#### Props

| 参数               | 类型                                                 | 默认值                                        | 说明
| :----------------- | :--------------------------------------------------- | :-------------------------------------------- | :---
| `collectContainer` | `string`                                             | `undefined`                                   | 选择器，指定待收集标题的区域（不传则使用 `document`）
| `listenerContainer`| `HTMLElement`                                       | `document.body`                               | 滚动监听容器，用于计算滚动位置与激活态
| `selector`         | `string \| string[]`                               | `['h1','h2','h3','h4','h5','h6']`            | 收集的标题选择器列表
| `requireAttr`      | `string`                                            | `undefined`                                   | 收集的元素必须包含的属性名（如 `id`）
| `affix`            | `boolean`                                           | `false`                                       | 是否默认固定为展开状态
| `position`         | [`Position`](../../utils/README.md)                 | `{ top: 200 }`                                | 浮动锚点的定位配置
| `scrollOffset`     | `number`                                            | `80`                                          | 滚动定位偏移量（避免被顶部导航遮挡）
| `reserveOffset`    | `number`                                            | `undefined`                                   | 额外预留偏移量，配合 `scrollOffset` 使用
| `delayInit`        | `number`                                            | `800`                                         | 延迟初始化时间，避免渲染未完成导致节点获取失败
| `affixText`        | `string`                                            | `i18n: anchor.text`                           | 悬浮收起状态显示的文案
| `duration`         | `number`                                            | `1000`                                        | 滚动动画时长（毫秒）

#### 事件

| 事件名  | 返回值  | 说明
| :------ | :------ | :---
| `click` | `MouseEvent \| undefined` | 锚点项点击时触发，返回原始事件对象

### 子组件：`<mi-anchor-link>` / `MiAnchor.Link`

#### Props（MiAnchorLink）

| 参数     | 类型      | 默认值       | 说明
| :------- | :-------- | :----------- | :---
| `id`     | `string`  | 必填         | 锚点对应的目标元素 `id`
| `title`  | `string`  | 必填         | 显示在目录中的标题文本
| `active` | `boolean` | `false`      | 是否处于选中高亮状态

#### 事件（MiAnchorLink）

| 事件名  | 返回值  | 说明
| :------ | :------ | :---
| `click` | `MouseEvent \| undefined` | 链接点击时触发，返回原始事件对象
