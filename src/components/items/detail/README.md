# 详情排版

> 「 详情排版 」组件主要作用在于单纯的图像排版无法放置过多的内容，通过点击展开详情的方式，填充更多的定制化内容。

## 使用示例

```vue
<template>
    <mi-items-detail
        v-model:active="active"
        :data="data"
        :max-width="1120"
        :thumb-setting="{
            width: { mobile: '100%', tablet: 280, laptop: 360 },
            height: { mobile: 'auto', tablet: 180, laptop: 220}
        }"
        @item-click="handleItemClick">
        <template #detail="cur">
            <!-- 返回的数据 -->
            item = {{ cur?.item }}
            index = {{ cur?.index }}
            <!-- 根据 active 切换详情内容 -->
            <template v-if="active === 0">
                <!-- 自定义详情内容 -->
            </template>
            <template v-if="active === 1">
                <!-- 自定义详情内容 -->
            </template>
        </template>
    </mi-items-detail>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref(-1)
const data = [
    {
        title: '《唐诗三百首》',
        subtitle: '唐·李白',
        thumb: 'https://image.makeit.vip/2024/12/31/libai.jpg'
    },
    {
        title: '《唐诗三百首》',
        subtitle: '唐·杜甫',
        thumb: 'https://image.makeit.vip/2024/12/31/dufu.jpg'
    }
]
</script>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../../theme/README.md) 」组件
>
> ### Tokens

#### ItemsDtail Tokens

| Token | 默认值
| :---- | :----
| `--mi-items-detail-line` | `--mi-primary`
| `--mi-items-detail-arrow` | `--mi-on-background`
| `--mi-items-detail-icon-border-default` | `rgba(--mi-rgb-error, 0.4)`
| `--mi-items-detail-icon-border-active` | `--mi-primary`
| `--mi-items-detail-icon-background-default` | `rgba(--mi-rgb-error, 0.1)`
| `--mi-items-detail-title-default` | `--mi-on-background`
| `--mi-items-detail-title-active` | `--mi-on-background`
| `--mi-items-detail-subtitle-default` | `rgba(--mi-rgb-on-background, 0.6)`
| `--mi-items-detail-subtitle-active` | `--mi-primary`

## API

### MiItemsDetail `<mi-items-detail>`

#### `MiItemsDetail` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `active` | `number (v-model)` | `-1` | 选中值
| `data` | [`DetailItem`](./README.md#interface-detailitem) | `[]` | 数据
| `number` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) | `{ mobile: 1, tablet: 2, laptop: 3 }` | 一行显示个数
| `maxWidth` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) | `100%` | 容器最大宽度
| `gap` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) `\|` [`gap`](../../../utils/README.md#interface-gap) | `100%` | 间距
| `animation` | `string ( __ANIMATION__ )` | `shake` | 详情容器弹出动画
| `arrowColor` | `string` | `''` | 箭头颜色
| `titleSetting` | [`TextSetting`](../../../utils/README.md#interface-textsetting) | `{ size: 18, bold: true, align: 'center' }` | 标题设置 ( 通用 )
| `subtitleSetting` | [`TextSetting`](../../../utils/README.md#interface-textsetting) | `{ size: 14, align: 'center' }` | 副标题设置 ( 通用 )
| `thumbSetting` | [`TextSetting`](../../../utils/README.md#interface-textsetting) | `{ radius: 8 }` | 缩略图设置
| `scrollToPosition` | `boolean` | `true` | 点击后滚动到指定位置 ( 当前点击项 )
| `scrollOffset` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) | `''` | 滚动指定位置时的偏移量

### Interface `DetailItem`

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `title` | `string \|` [`TextSetting`](../../../utils/README.md#interface-textsetting) | `''` | 标题设置 ( 单项 )
| `subtitle` | `string \|` [`TextSetting`](../../../utils/README.md#interface-textsetting) | `''` | 副标题设置 ( 单项 )
| `thumb` | `string` | `''` | 缩略图
