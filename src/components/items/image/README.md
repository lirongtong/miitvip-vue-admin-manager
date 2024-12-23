# 图片排版

> 「 图片排版 」组件用于在应用程序中显示图像的排版，它提供了各种自定义选项来控制图像的外观和行为。

## 使用示例

### 默认效果

```vue
<template>
    <mi-items-image :data="data" :hover="{ open: true, scale: true }" />
</template>

<script setup lang="ts">
import thumb from '@/assets/images/background.jpg'

const data = [
    {
        title: { text: '《早发白帝城》', bold: true, align: 'center', size: 22 },
        subtitle: { text: `唐·李白`, align: 'center', size: 16 },
        thumb: thumb,
        intro: {
            text: `朝辞白帝彩云间，千里江陵一日还。<br />两岸猿声啼不住，轻舟已过万重山。`,
            align: `center`,
            size: 16
        }
    }
]
</script>
```

### 个数配置

```vue
<template>
    <!-- number 默认配置 { mobile: 1, tablet: 3, laptop: 4 } -->
    <mi-items-image
        :data="data"
        :hover="{ open: true, scale: true }"
        :number="{ mobile: 1, tablet: 2, laptop: 3 }" />
</template>

<script setup lang="ts">
import thumb from '@/assets/images/background.jpg'

const data = [
    {
        title: { text: '《早发白帝城》', bold: true, align: 'center', size: 22 },
        subtitle: { text: `唐·李白`, align: 'center', size: 16 },
        thumb: thumb,
        intro: {
            text: `朝辞白帝彩云间，千里江陵一日还。<br />两岸猿声啼不住，轻舟已过万重山。`,
            align: `center`,
            size: 16
        }
    },
    {
        title: { text: '《客中行》', bold: true, align: 'center', size: 22 },
        subtitle: { text: `唐·李白`, align: 'center', size: 18 },
        thumb: thumb,
        intro: {
            text: `兰陵美酒郁金香，玉碗盛来琥珀光。<br />但使主人能醉客，不知何处是他乡。`,
            align: `center`,
            size: 16
        }
    },
    {
        title: { text: '《望庐山瀑布》', bold: true, align: 'center', size: 22 },
        subtitle: { text: `唐·李白`, align: 'center', size: 18 },
        thumb: thumb,
        intro: {
            text: `日照香炉生紫烟，遥看瀑布挂前川。<br />飞流直下三千尺，疑是银河落九天。`,
            align: `center`,
            size: 16
        }
    }
]
</script>
```

### 链接配置

```vue
<template>
    <mi-items-image :data="data" :hover="{ open: true, scale: true }" />
</template>

<script setup lang="ts">
import thumb from '@/assets/images/background.jpg'

const data = [
    {
        title: { text: '《早发白帝城》', bold: true, align: 'center', size: 22 },
        subtitle: { text: `唐·李白`, align: 'center', size: 16 },
        thumb: thumb,
        intro: {
            text: `朝辞白帝彩云间，千里江陵一日还。<br />两岸猿声啼不住，轻舟已过万重山。`,
            align: `center`,
            size: 16
        },
        link: `https://admin.makeit.vip/start`,
        target: `_blank`
    }
]
</script>
```

### 宽高配置

> 默认按 100% 区域宽度进行展示，按 number 一行个数进行均分，若图片大小不一致，可通过自定义宽高配置宽高。

```vue
<template>
    <mi-items-image
        :data="data"
        :hover="{ open: true, scale: true }"
        :width="320"
        :center="true" />
</template>

<script setup lang="ts">
import thumb from '@/assets/images/background.jpg'

const data = [
    {
        title: { text: '《早发白帝城》', bold: true, align: 'center', size: 22 },
        subtitle: { text: `唐·李白`, align: 'center', size: 16 },
        thumb: thumb,
        intro: {
            text: `朝辞白帝彩云间，千里江陵一日还。<br />两岸猿声啼不住，轻舟已过万重山。`,
            align: `center`,
            size: 16
        },
        link: `https://admin.makeit.vip/start`,
        target: `_blank`
    }
]
</script>
```

### 下划线颜色配置

```vue
<template>
    <!-- hover 显示下划线, 默认颜色为：透明 -->
    <mi-items-image
        :data="data"
        :hover="{ open: true, scale: true }"
        :width="320"
        :center="true"
        line-color="red" />
</template>

<script setup lang="ts">
import thumb from '@/assets/images/background.jpg'

// title & subtitle 默认居左显示
const data = [
    {
        title: '《早发白帝城》',
        subtitle: '唐·李白',
        thumb: thumb,
        intro: {
            text: `朝辞白帝彩云间，千里江陵一日还。<br />两岸猿声啼不住，轻舟已过万重山。`,
            align: `center`,
            size: 16
        },
        link: `https://admin.makeit.vip/start`,
        target: `_blank`
    }
]
</script>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../../theme/README.md) 」组件

## API

### MiItemsImage `<mi-items-image>`

#### `MiItemsImage` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `data` | [`ImageItem`](./README.md#interface-imageitem) | `[]` | 图片数据
| `number` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) | `{ mobile: 1, tablet: 3, laptop: 4 }` | 一行显示个数
| `width` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) | `''` | 每一项的显示宽度 ( 未配置时, 以 100% 宽度与一行显示项为基础自适应宽度 )
| `height` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) | `''` | 每一项的显示高度 ( 适用图片高度不一致时自定义限制统一高度 )
| `radius` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) | `''` | 每一项的圆角
| `gap` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) \| [`Gap`](../../../utils/README.md#interface-gap) | `16` | 每一项的间距
| `hover` | [`ImageItemHover`](./README.md#interface-imageitemhover) | `{}` | 鼠标移入效果配置
| `center` | `boolean` | `false` | 是否居中显示 ( 结合 width 及 gap 设定最大宽度后居中 - 默认 100% 宽度居中 )
| `lineColor` | `string` | `transparent` | 下划线颜色值

### Interface `ImageItem`

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `title` | `string \|` [`TextSetting`](../../../utils/README.md#interface-textsetting) | `''` | 标题
| `subtitle` | `string \|` [`TextSetting`](../../../utils/README.md#interface-textsetting) | `''` | 副标题
| `intro` | `string \|` [`TextSetting`](../../../utils/README.md#interface-textsetting) | `''` | 介绍内容
| `thumb` | `string` | `''` | 图片地址
| `link` | `string` | `''` | 链接地址
| `target` | `_blank \| _self` | `_self` | 链接打开方式

### Interface `ImageItemHover`

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `open` | `boolean` | `_self` | 开启 hover 效果
| `animation` | `'slide-up' \| 'slide-down' \| 'slide-left' \| 'slide-right'` | `slide-up` | 上下左右滑动出现
| `background` | `string` | `rgba(var(--mi-rgb-shadow), 0.2)` | 背景颜色
| `backdrop` | `string` | `blur(0.5rem)` | 背景过滤
| `scale` | `boolean` | `true` | 图片放大至区域宽高100%
