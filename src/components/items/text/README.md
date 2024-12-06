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
| `background` | `TextItemBackground` | `{}` | 背景配置
| `title` | `TextItemTitle` | `{}` | 标题配置
| `intro` | `TextItemContent` | `{}` | 内容配置
| `item` | `VNodeTypes` | `''` | 项目自定义内容
