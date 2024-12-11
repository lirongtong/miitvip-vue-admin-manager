# 文案排版

> 「 文案排版 」 组件根据提供的简易文案内容，快速生成排版内容。

## 使用示例

### 基础应用

```html
<mi-items-text
    :items=['文案一', '文案二']
    :marker="{
        type: 'circle',
        center: true,
        size: 6,
        color: 'red'
    }" />
```

### 复杂配置

```html
<mi-items-text
    :items="params.items"
    :marker="params.marker"
    :indent="32"
    :gap="24"
    :title="params.title"
    :intro="params.intro" />

<script lang="ts" setup>
import { reactive } from 'vue'

const params = reactive({
    items: [
        {
            gap: 8,
            title: 'Text Item Title',
            intro: 'Text Item Intro',
            items: [
                'Text Item 1',
                'Text Item 2',
                'Text Item 3'
            ]
        },
        {
            gap: 8,
            title: 'Text Item Title 2',
            intro: 'Text Item Intro 2',
            items: [
                'Text Item 21',
                'Text Item 22',
                'Text Item 23'
            ]
        }
    ],
    marker: {
        type: `number`,
        center: true
    },
    title: {
        size: 24,
        bold: true,
        marker: { type: 'upper-letter', gap: 8, suffix: '.' }
    },
    intro: { color: '#999' }
})
</script>
```

### 无限嵌套

```html
<mi-items-text
    :items="['Item Text 1', 'Item Text 2']">
    <template #item>
        <mi-items-text :items="['Item Text 11', 'Item Text 12']">
            <template #item>
                <mi-items-text :items="['Item Text 111', 'Item Text 112']" />
                <!-- ... 无限层级 ... -->
            </template>
        </mi-items-text>
    </template>
</mi-items-text>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

## API

### MiItemsText `<mi-items-text>`

#### `MiItemsText` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `items` | `string[] \| TextItem[]` | `[]` | 列表
| `marker` | `TextItemMarker` | `{}` | 标记配置
| `size` | `number \| string \| DeviceSize` | `16` | 文案字体大小
| `bold` | `boolean` | `false` | 文案是否加粗
| `padding` | `number \| string \| Position` | `0` | 组件容器内边距
| `indent` | `number \| string \| DeviceSize` | `0` | 项目缩进
| `gap` | `number \| string \| DeviceSize` | `0` | 每个项目之间的间距
| `border` | `TextItemBorder` | `{}` | 边框配置
| `radius` | `number \| string \| DeviceSize` | `0` | 圆角
| `background` | [`TextItemBackground`](./README.md#textitembackground-属性--interface-) | `{}` | 背景配置
| `title` | [`TextItemTitle`](./README.md#textitemtitle-属性--interface-) | `{}` | 标题配置
| `intro` | [`TextItemContent`](./README.md#textitemcontent-属性--interface-) | `{}` | 内容配置
| `item` | `VNodeTypes` | `''` | 项目自定义内容

#### `MiItemsTextMarker` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `marker` | [`TextItemMarker`](./README.md#textitemmarker-属性--interface-) | `{}` | 项目标记配置
| `number` | `number` | `''` | 项目标记数字 ( type = number/upper-number/letter/upper-letter 时有效 )

#### `TextItem` 属性 ( `Interface` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `title` | `string` | `''` | 项目标题
| `intro` | `string` | `''` | 项目介绍
| `gap` | `number \| string \| DeviceSize` | `''` | 项目间距
| `items` | `string[]` | `[]` | 项目内容

#### `TextItemMarker` 属性 ( `Interface` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `type` | `square \| circle \| letter \| upper-letter \| number \| upper-number \| roman-number` | `''` | 项目标记类型
| `prefix` | `string` | `''` | 项目标记前缀
| `suffix` | `string` | `''` | 项目标记后缀
| `color` | `string` | `''` | 项目标记颜色 ( square / circle 有效 )
| `size` | `number \| string \| DeviceSize` | `''` | 项目标记大小 ( square / circle 有效 )
| `gap` | `number \| string \| DeviceSize` | `''` | 项目标记与内容的间距
| `center` | `boolean` | `false` | 项目标记是否居中
| `margin` | `number \| string \| Position` | `''` | 项目标记外边距

#### `TextItemBackground` 属性 ( `Interface` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `color` | `string` | `''` | 背景颜色
| `image` | `string` | `''` | 背景图片
| `aspectRatio` | `string` | `''` | 背景图片宽高比

#### `TextItemBorder` 属性 ( `Interface` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `color` | `string` | `''` | 边框颜色
| `width` | `number \| string \| DeviceSize` | `''` | 边框大小

#### `TextItemContent` 属性 ( `Interface` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `color` | `string` | `''` | 内容颜色
| `size` | `number \| string \| DeviceSize` | `''` | 字体大小
| `bold` | `boolean` | `false` | 是否加粗
| `margin` | `number \| string \| Position` | `''` | 外边距

#### `TextItemTitle` 属性 ( `Interface` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `color` | `string` | `''` | 内容颜色
| `size` | `number \| string \| DeviceSize` | `''` | 字体大小
| `bold` | `boolean` | `false` | 是否加粗
| `margin` | `number \| string \| Position` | `''` | 外边距
| `marker` | [`TextItemMarker`](./README.md#textitemmarker-属性--interface-) | `{}` | 项目标记配置
