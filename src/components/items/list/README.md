# 列表排版

> 「 列表排版 」组件用于在应用程序中显示列表的排版，它提供了各种自定义选项来控制列表的外观和行为。

## 使用示例

### 默认效果

```vue
<template>
    <mi-items-list :data="data" />
</template>

<script setup lang="ts">
const data = [
    {
        thumb: 'https://image.makeit.vip/2024/12/24/news1.jpg',
        title: '叙新当局称就解散武装派别达成协议 库尔德人武装未出席会议',
        intro: '叙利亚新领导层周二宣布，“叙利亚沙姆解放武装”领导人艾哈迈德·沙拉已同叙其他武装派别领导人就解散所有武装派别并将其纳入新国防部麾下达成协议。法新社报导指，美国支持的、库尔德人领导的、控制着叙东北部大片地区的部队的代表没有出席会议。',
        date: '2024-12-24 19:44'
    },
    {
        thumb: 'https://image.makeit.vip/2024/12/24/news2.jpg',
        title: '“明星车企”极越岁末突然倒闭，折射中国新能源车企低利润下的挣扎',
        intro: '在中国新能源汽车崛起的大潮中，倒下的品牌屡见不鲜，但极越汽车的突然倒闭还是令市场错愕——12月11日，CEO夏一平在一个视频会议上突然宣布，公司遇到困难，而且11月员工的社保已经无法缴纳，并随后给出清退方案。',
        date: '2024-12-24 10:32',
        link: 'https://www.bbc.com/zhongwen/articles/cvg9p54j1qyo/simp',
        target: '_blank',
        category: '新能源'
    },
    {
        thumb: 'https://image.makeit.vip/2024/12/24/news3.jpg',
        title: '黄金交易提醒：美国核心耐用品订单强劲反弹，美债收益率再攀新高，金价反弹受阻回落',
        intro: '周二（12月24日）亚市早盘，现货黄金窄幅震荡，目前交投于2615.35美元/盎司附近。金价在周一低迷的假日季交投中走低，美国核心耐用品订单强劲反弹，帮助美元走强，美国10年期国债收益率刷新逾半年高点，令金价承压明显。',
        date: '2024-12-24 07:40',
        link: 'https://cn.investing.com/news/forex-news/article-2614043',
        target: '_blank'
    }
]
</script>
```

### 卡片类型

```vue
<template>
    <mi-items-list type="card" :data="data" />
</template>

<script setup lang="ts">
const data = [
    {
        thumb: 'https://image.makeit.vip/2024/12/24/news1.jpg',
        title: '叙新当局称就解散武装派别达成协议 库尔德人武装未出席会议',
        intro: '叙利亚新领导层周二宣布，“叙利亚沙姆解放武装”领导人艾哈迈德·沙拉已同叙其他武装派别领导人就解散所有武装派别并将其纳入新国防部麾下达成协议。法新社报导指，美国支持的、库尔德人领导的、控制着叙东北部大片地区的部队的代表没有出席会议。',
        date: '2024-12-24 19:44'
    },
    {
        thumb: 'https://image.makeit.vip/2024/12/24/news2.jpg',
        title: '“明星车企”极越岁末突然倒闭，折射中国新能源车企低利润下的挣扎',
        intro: '在中国新能源汽车崛起的大潮中，倒下的品牌屡见不鲜，但极越汽车的突然倒闭还是令市场错愕——12月11日，CEO夏一平在一个视频会议上突然宣布，公司遇到困难，而且11月员工的社保已经无法缴纳，并随后给出清退方案。',
        date: '2024-12-24 10:32',
        link: 'https://www.bbc.com/zhongwen/articles/cvg9p54j1qyo/simp',
        target: '_blank',
        category: '新能源'
    },
    {
        thumb: 'https://image.makeit.vip/2024/12/24/news3.jpg',
        title: '黄金交易提醒：美国核心耐用品订单强劲反弹，美债收益率再攀新高，金价反弹受阻回落',
        intro: '周二（12月24日）亚市早盘，现货黄金窄幅震荡，目前交投于2615.35美元/盎司附近。金价在周一低迷的假日季交投中走低，美国核心耐用品订单强劲反弹，帮助美元走强，美国10年期国债收益率刷新逾半年高点，令金价承压明显。',
        date: '2024-12-24 07:40',
        link: 'https://cn.investing.com/news/forex-news/article-2614043',
        target: '_blank'
    }
]
</script>
```

### 字体设置

```vue
<template>
    <mi-items-list :data="data" :title-setting="{ size: 24, bold: true }" />
</template>

<script setup lang="ts">
const data = [
    {
        thumb: 'https://image.makeit.vip/2024/12/24/news1.jpg',
        title: '叙新当局称就解散武装派别达成协议 库尔德人武装未出席会议',
        intro: '叙利亚新领导层周二宣布，“叙利亚沙姆解放武装”领导人艾哈迈德·沙拉已同叙其他武装派别领导人就解散所有武装派别并将其纳入新国防部麾下达成协议。法新社报导指，美国支持的、库尔德人领导的、控制着叙东北部大片地区的部队的代表没有出席会议。',
        date: '2024-12-24 19:44'
    },
    {
        thumb: 'https://image.makeit.vip/2024/12/24/news2.jpg',
        title: '“明星车企”极越岁末突然倒闭，折射中国新能源车企低利润下的挣扎',
        intro: '在中国新能源汽车崛起的大潮中，倒下的品牌屡见不鲜，但极越汽车的突然倒闭还是令市场错愕——12月11日，CEO夏一平在一个视频会议上突然宣布，公司遇到困难，而且11月员工的社保已经无法缴纳，并随后给出清退方案。',
        date: '2024-12-24 10:32',
        link: 'https://www.bbc.com/zhongwen/articles/cvg9p54j1qyo/simp',
        target: '_blank',
        category: '新能源'
    },
    {
        thumb: 'https://image.makeit.vip/2024/12/24/news3.jpg',
        title: '黄金交易提醒：美国核心耐用品订单强劲反弹，美债收益率再攀新高，金价反弹受阻回落',
        intro: '周二（12月24日）亚市早盘，现货黄金窄幅震荡，目前交投于2615.35美元/盎司附近。金价在周一低迷的假日季交投中走低，美国核心耐用品订单强劲反弹，帮助美元走强，美国10年期国债收益率刷新逾半年高点，令金价承压明显。',
        date: '2024-12-24 07:40',
        link: 'https://cn.investing.com/news/forex-news/article-2614043',
        target: '_blank'
    }
]
</script>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### ItemsList Tokens

| Token | 默认值
| :---- | :----
| `--mi-items-list-bg` | `--mi-on-background`
| `--mi-items-list-text` | `--mi-background`
| `--mi-items-list-date` | `rgba(--mi-rgb-background, 0.5)`
| `--mi-items-list-line-default` | `rgba(--mi-rgb-background, 0.1)`
| `--mi-items-list-line-hover` | `--mi-error-container`

## API

### MiItemsList `<mi-items-list>`

#### `MiItemsList` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `type` | `string` | `list` | 类型
| `data` | `ListItem` | `[]` | 数据
| `thumbSetting` | `ListItemThumb` | `{ radius: 8, width: { mobile: '100%', tablet: 260, laptop: 320 }, margin: props?.reverse ? { left: { mobile: 0, tablet: 24, laptop: 32 } } : { right: { mobile: 0, tablet: 24, laptop: 32 } } }` | 缩略图配置
| `titleSetting` | `TextSetting` | `{ size: { mobile: 18, tablet: 20, laptop: 24 }, bold: true, lineHeight: { mobile: 24, tablet: 30, laptop: 36 } }` | 标题配置
| `introSetting` | `TextSetting` | `{ size: { mobile: 14, tablet: 16, laptop: 18 }, lineHeight: { mobile: 20, tablet: 24, laptop: 28 } }` | 简介配置
| `dateSetting` | `TextSetting` | `{ size: { mobile: 12, tablet: 14 } }` | 时间 & 分类配置
| `radius` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) | `''` | 最外层容器圆角 ( 同时适用卡片类型 )
| `background` | `string` | `var(--mi-items-list-bg)` | 最外层容器背景色
| `padding` | `number \| string \|` [`Position`](../../../utils/README.md#interface-position) | `16` | 容器内间距
| `reverse` | `boolean` | `false` | 反向显示 ( 横排 )
| `dividing` | `ListItemDividing` | `{ height: 1, margin: { top: 20, bottom: 20 } }` | 分割线 ( 仅在非卡片显示时有效 )

### Interface `ListItem`

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `id` | `string \| number` | `''` | 序号
| `thumb` | `string` | `''` | 缩略图
| `title` | `string \|` [`TextSetting`](../../../utils/README.md#interface-textsetting) | `''` | 标题
| `date` | `string \|` [`TextSetting`](../../../utils/README.md#interface-textsetting) | `''` | 时间
| `intro` | `string \|` [`TextSetting`](../../../utils/README.md#interface-textsetting) | `''` | 介绍
| `link` | `string` | `''` | 链接地址
| `target` | `_blank \| _self` | `_self` | 链接打开方式
| `query` | `object` | `{}` | 链接参数
| `author` | `string` | `''` | 作者
| `category` | `string` | `''` | 分类

### Interface `ListItemThumb`

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `width` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) | `''` | 宽度
| `height` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) | `''` | 高度
| `radius` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) | `''` | 圆角
| `background` | `string` | `''` | 背景色
| `scale` | `boolean` | `false` | Hover 悬停时放大图片 (1.2)
| `align` | `'start' \| 'end' \| 'center'` | `center` | 对齐方式
| `margin` | `number \| string \|` [`Position`](../../../utils/README.md#interface-position) | `''` | 外间距

### Interface `ListItemDividing`

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `display` | `boolean` | `true` | 是否显示
| `color` | `string` | `''` | 颜色
| `height` | `number \| string \|` [`DeviceSize`](../../../utils/README.md#interface-devicesize) | `''` | 高度
| `margin` | `number \| string \|` [`Position`](../../../utils/README.md#interface-position) | `''` | 外间距
