# 联想搜索

> 「 联想搜索 」 组件根据给定的关键词，搜索出相关的内容并给予提示，且支持远程搜索 / 搜索结果分页配置等。

## 使用示例

### 默认

```html
<template>
    <mi-search :data="data" search-key="title" />
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import type { SearchData } from '@miitvip/admin-pro'
    import { ExclamationCircleOutlined, DashboardOutlined } from '@ant-design/icons-vue'

    const data = ref<SearchData[]>([
        {
            title: `关于 MAP`,
            summary: `框架特性 · 设计初衷`,
            icon: ExclamationCircleOutlined,
            path: '/about'
        },
        {
            title: `控制中心`,
            summary: `纵观全局 · 运筹帷幄`,
            icon: DashboardOutlined,
            path: '/dashboard'
        }
    ])
</script>
```

### 远程

```html
<template>
    <!-- api ( string ) -->
    <mi-search search-key="title" search-action="/v1/search/components" />

    <!-- action ( function ) -->
    <mi-search :data="data" search-key="title" :search-action="() => handleSearchData()" />
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import type { SearchData } from '@miitvip/admin-pro'

    const data = ref<SearchData[]>()

    const getSearchData = (): SearchData[] => {
        // do something
        return []
    }

    const handleSearchData = async () => {
        // do something
        // get search data
        data.value = await getSearchData()
    }
</script>
```

### 自定义模板

```html
<template>
    <mi-search search-key="title" :data="data">
        <template v-slot:itemTemplate>
            <div class="avatar">
                <mi-search-key type="image" tag="img" name="avatar" />
            </div>
            <div class="info">
                <div class="title">
                    <mi-search-key name="title" />
                </div>
                <div class="content">
                    <mi-search-key name="content" />
                </div>
            </div>
        </template>
    </mi-search>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import type { SearchData } from '@miitvip/admin-pro'
    import { ThunderboltOutlined, CrownOutlined } from '@ant-design/icons-vue'

    const data = ref<SearchData[]>([
        {
            title: `快速上手`,
            summary: `一目十行 · 滴水成冰`,
            icon: ThunderboltOutlined,
            path: '/start'
        },
        {
            title: `主题定制`,
            summary: `精妙绝伦 · 美不胜收`,
            icon: CrownOutlined,
            path: '/theming'
        }
    ])
</script>

<style lang="less" scope>
    .avatar {
        width: 2rem;
        /* ... */
    }
</style>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Search Tokens

| Token | 默认值
| :---- | :----
| `--mi-search-key` | `--mi-primary`
| `--mi-search-loading` | `--mi-primary`
| `--mi-search-input-text` | `--mi-primary`
| `--mi-search-input-background-color` | `transparent`
| `--mi-search-input-background-gradient-start` | `transparent`
| `--mi-search-input-background-gradient-stop` | `transparent`
| `--mi-search-input-placeholder` | `--mi-on-surface-variant`
| `--mi-search-input-border` | `rgba(--mi-rgb-on-surface-variant, .5)`
| `--mi-search-list-border` | `rgba(--mi-rgb-on-surface-variant, .5);`
| `--mi-search-list-background-color` | `transparent`
| `--mi-search-list-background-gradient-start` | `--mi-surface`
| `--mi-search-list-background-gradient-stop` | `--mi-surface-variant`
| `--mi-search-list-item-divider` | `rgba(--mi-rgb-on-surface-variant, .15)`
| `--mi-search-list-item-title` | `--mi-on-surface-variant`
| `--mi-search-list-item-summary` | `rgba(--mi-rgb-on-surface-variant, .6)`
| `--mi-search-list-item-avatar-border` | `--mi-primary`
| `--mi-search-list-pagination-border` | `rgba(--mi-rgb-on-surface-variant, .3)`
| `--mi-search-list-pagination-background` | `rgba(--mi-rgb-surface-variant, .2)`
| `--mi-search-list-pagination-input-border` | `rgba(--mi-rgb-on-surface-variant, .3)`
| `--mi-search-list-pagination-input-text` | `--mi-shadow`
| `--mi-search-list-pagination-control-default` | `--mi-on-surface-variant`
| `--mi-search-list-pagination-control-disabled` | `rgba(--mi-rgb-on-surface-variant, .2)`

## API

### MiSearch `<mi-search>`

#### `MiSearch` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `width` | `number \| string \|` [`DeviceSize`](../../utils/README.md) | `''` | 搜索框宽度
| `height` | `number \| string \|` [`DeviceSize`](../../utils/README.md) | `''` | 搜索框高度
| `radius` | `number \| string \|` [`DeviceSize`](../../utils/README.md) | `48` | 搜索框圆角弧度
| `value ( v-model )` | `number \| string` | `48` | 搜索值
| `placeholder` | `string` | `'搜索'` | 搜索框占位内容
| `suffix` | `vSlot` | `<SearchOutlined />` | 后缀
| `searchParams` | `object` | `{}` | 搜索参数
| `searchMethod` | `string` | `get` | 搜索请求方式
| `searchAction` | `string \| function` | `''` | 搜索动作
| `searchKey` | `string` | `''` | 搜索关键词 `key` ( 必填 )
| `searchDelay` | `number \| string` | `''` | 搜索延迟
| `listWidth` | `number \| string \|` [`DeviceSize`](../../utils/README.md) | `''` | 列表宽度
| `listHeight` | `number \| string \|` [`DeviceSize`](../../utils/README.md) | `''` | 列表高度
| `listRadius` | `number \| string \|` [`DeviceSize`](../../utils/README.md) | `8` | 列表圆角弧度
| `listAnimation` | `string` | `8` | 列表动画效果
| `listNoDataText` | `string \| vSlot` | `'暂无符合条件的数据'` | 搜素结果无数据提示语
| `itemTemplate` | `vSlot` | `''` | 自定义 `item` 模板
| `pagination` | `boolean` | `true` | 是否分页
| `pageSize` | `number \| string \|` [`DeviceSize`](../../utils/README.md) | `10` | 分页每页数据
| `data` | `SearchData` | `[]` | 本地搜索数据

#### `MiSearch` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `pressEnter` | Search | 键盘 `Enter` 键按下的回调事件
| `itemClick` | *None* | 搜索列表 `Item` 点击回调事件
| `change` | *None* | 搜索 `Key` 改变的回调事件
| `close` | *None* | 搜索列表关闭的回调事件

### MiSearchKey `<mi-search-key>`

#### `MiSearchKey` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `name` | `string` | `''` | 名称 ( 必填 )
| `tag` | `string` | `span` | 标签 `keyof HTMLElementTagNameMap`
| `type` | `string` | `text` | 类型 `['text', 'image', 'link']`
| `content` | `vSlot` | `''` | 内容
