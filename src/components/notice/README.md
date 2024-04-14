# 消息中心

> 「 消息中心 」 组件多用于全局消息展示，以弹窗的形式展示消息列表，支持多「 Tab 」切换展示

## 使用

### 默认

```html
<mi-notice />
```

### 配置 `items` 消息列表

```html
<template>
    <!-- 仅设定 items, 默认采用 mi-notice-item 生成列表 -->
    <mi-notice :width="360" :items="items" />
</template>

<script lang="ts" setup>
    import { ref } from 'vue'

    const items = ref([
        {title: '每日签到', summary: '连续签到，享8重好礼！'},
        {title: '每日签到', summary: '连续签到，享8重好礼！'}
    ])
</script>
```

### 配置 `tabs` 消息列表

```html
<template>
    <mi-notice v-model:tab-active="active" :width="360" :tabs="tabs" :items="items" />
    <mi-notice v-model:tab-active="active" :width="360" :tabs="tabsObj" />
</template>

<script lang="ts" setup>
    import { ref, reactive } from 'vue'

    const active = ref<string>('0')
    // string tabs ( 根据 tabs index 取值 - items )
    const tabs = ref<string[]>(['系统消息', '活动通知'])
    const items = reactive([
        [
            {title: '每日签到', summary: '连续签到，享8重好礼！'},
            {title: '每日签到', summary: '连续签到，享8重好礼！'}
        ],
        [
            {title: '每日签到', summary: '连续签到，享8重好礼！'},
            {title: '每日签到', summary: '连续签到，享8重好礼！'}
        ]
    ])
    // object tabs
    const tabsObj = reactive([
        {
            key: '0',
            name: '系统消息',
            items: [
                {title: '每日签到', summary: '连续签到，享8重好礼！'},
                {title: '每日签到', summary: '连续签到，享8重好礼！'}
            ]
        },
        {
            key: '1',
            name: '活动通知',
            items: [
                {title: '每日签到', summary: '连续签到，享8重好礼！'},
                {title: '每日签到', summary: '连续签到，享8重好礼！'}
            ]
        }
    ])
</script>
```

### 自定义 `tabs` / `items` / `Click` 事件等

```html
<template>
    <mi-notice :width="360" v-model:tab-active="active" @item-click="handleItemClick">
        <mi-notice-tab key="1" name="系统消息">
            <template #icon><AuditOutlined /></template>
            <mi-notice-item v-for="item in items" :title="item?.title" :content="item?.content">
                <template v-if="item?.tag" #tag>
                    <component :is="item?.tag" />
                </template>
            </mi-notice-item>
        </mi-notice-tab>
        <mi-notice-tab key="2" name="活动通知">
            <mi-notice-item title="每日签到" summary="连续签到，享8重好礼！" @click="handleSingleItemClick" />
        </mi-notice-tab>
    </mi-notice>
</template>

<script lang="ts" setup>
    import { ref, createVNode } from 'vue'
    import { AuditOutlined, FireFilled, LikeFilled } from '@ant-design/icons-vue'

    const active = ref<string>('1')
    const items = [
        {
            title: '扬鞭东指',
            content: '站在历史的海岸漫溯那一道道历史沟渠：楚大夫沉吟泽畔，九死不悔;魏武帝扬鞭东指，壮心不已;陶渊明悠然南山，饮酒采菊……他们选择了永恒，纵然谄媚诬蔑视听，也不随其流扬其波，这是执着的选择;纵然马革裹尸，魂归狼烟，只是豪壮的选择;纵然一身清苦，终日难饱，也愿怡然自乐，躬耕陇亩，这是高雅的选择。在一番选择中，帝王将相成其盖世伟业，贤士迁客成其千古文章。',
            tag: createVNode(FireFilled, { color: 'red' })
        },
        {
            title: '心的本色',
            content: '心的本色该是如此。成，如朗月照花，深潭微澜，不论顺逆，不论成败的超然，是扬鞭策马，登高临远的驿站;败，仍滴水穿石，汇流入海，有穷且益坚，不坠青云的傲岸，有“将相本无主，男儿当自强”的倔强。荣，江山依旧，风采犹然，恰沧海巫山，熟视岁月如流，浮华万千，不屑过眼烟云;辱，胯下韩信，雪底苍松，宛若羽化之仙，知退一步，海阔天空，不肯因噎废食。'
        },
        {
            title: '物质/欲望',
            content: '快乐=物质/欲望。这是美国经济学家萨缪尔森提出的快乐方程式。从经济学的观点看，物质消费越大，欲望越小，快乐就越大，正应了中国人的一句古话“知足常乐”。反之，如果一个人的物质消费有限，而欲望无穷大，将会怎样呢?路瓦栽夫人有那么多“梦想”，又有那么多“陶醉”，她怎么能不痛苦、伤心呢?',
            tag: createVNode(LikeFilled, { color: 'green' })
        }
    ]
    const handleItemClick = () => {
        console.log('绑定在 tabs 上的 item click 事件')
    }

    const handleSingleItemClick = () => {
        console.log('单独的 item click 事件, 优先级高于 tabs 上的 item click')
    }
</script>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Notice Tokens

| Token | 默认值
| :---- | :----
| `--mi-notice-text` | `--mi-on-surface-variant`
| `--mi-notice-border` | `--mi-surface-variant`
| `--mi-notice-background` | `--mi-surface-variant`

#### Notice Tab Tokens

| Token | 默认值
| :---- | :----
| `--mi-notice-tab-text-default` | `--mi-on-background`
| `--mi-notice-tab-text-active` | `--mi-on-secondary`
| `--mi-notice-tab-text-hover` | `--mi-on-background`
| `--mi-notice-tab-icon-default` | `--mi-on-background`
| `--mi-notice-tab-icon-active` | `--mi-on-secondary`
| `--mi-notice-tab-icon-hover` | `--mi-on-background`
| `--mi-notice-tab-background-default` | `rgba(--mi-rgb-background, .5)`
| `--mi-notice-tab-background-start` | `--mi-primary`
| `--mi-notice-tab-background-hint` | `--mi-secondary`
| `--mi-notice-tab-background-stop` | `--mi-tertiary`

#### Notice Item Tokens

| Token | 默认值
| :---- | :----
| `--mi-notice-item-background` | `rgba(--mi-rgb-background, .5)`
| `--mi-notice-item-border` | `--mi-inverse-on-surface`
| `--mi-notice-item-avatar` | `--mi-primary`
| `--mi-notice-item-text` | `--mi-on-surface`
| `--mi-notice-item-summary` | `--mi-inverse-surface`
| `--mi-notice-item-date` | `rgba(--mi-rgb-inverse-surface, .5)`
| `--mi-notice-item-tag-text` | `--mi-on-tertiary`
| `--mi-notice-item-tag-background` | `--mi-tertiary`
| `--mi-notice-item-tag-border` | `--mi-tertiary`
| `--mi-notice-item-content-background` | `rgba(--mi-rgb-background, .7)`
| `--mi-notice-item-content-border` | `--mi-surface-variant`
| `--mi-notice-item-content-text` | `--mi-on-surface-variant`

## API

### MiNotice `<mi-notice>`

#### `MiNotice` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `icon` | `vSlot` | `''` | 弹窗触发点的图标
| `trigger` | `string` | `click` | 弹窗触发方式 `['click', 'hover', 'focus', 'contextmenu']`
| `amount` | `number` | `1` | 数量
| `maxAmount` | `number` | `99` | 封顶展示的数字值
| `dot` | `boolean` | `true` | 是否显示红点
| `showZero` | `boolean` | `false` | 当数值为 `0` 时，是否展示 `Badge`
| `placement` | `string` | `bottom` | 弹窗打开位置 `['top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'leftTop', 'leftBottom', 'rightTop', 'rightBottom']`
| `background` | `string` | `''` | 弹窗背景色
| `tabDefaultActive` | `string \| number` | `0` | 选中 Tab ( 默认第`1`个 )
| `tabGap` | `number \| string \|` [`DeviceSize`](../../utils/README.md) | `16` | Tab 间距
| `tabCenter` | `boolean` | `true` | Tab 居中适配

#### `MiNotice` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `tabChange` | *Active Tab* `key` | `Tab` 切换回调事件
| `tabClick` | *Active Tab* `key` | `Tab` 点击回调事件
| `itemClick` | *None* | `Item` 点击回调事件

### MiNoticeTab `<mi-notice-tab>`

#### `MiNoticeTab` 属性 ( `Properties` )

| 参数 | 类型 | 是否必填 | 默认值 | 说明
| :---- | :---- | :---- | :---- | :----
| `name` | `string` | `true` | `''` | 唯一值 ( 对应 `notice` 的 `tab-active` )
| `tab` | `vSlot` | |  `''` | `Tab` 显示名称
| `icon` | `vSlot` | |  `''` | 图标
| `items` | `NoticeItem` | |  `[]` | 消息列表

### MiNoticeItem `<mi-notice-item>`

#### `MiNoticeItem` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `title` | `vSlot` | `''` | 标题
| `summary` | `vSlot` | `''` | 摘要 ( 未设定时, 根据 `content` 裁剪 )
| `tag` | `vSlot` | `''` | 标签
| `tagColor` | `vSlot` | `''` | 标签颜色 ( `tag` 非 `slot` 时有效 )
| `tagIcon` | `vSlot` | `''` | 标签图标 ( `tag` 非 `slot` 时有效 )
| `date` | `vSlot` | `''` | 日期
| `avatar` | `vSlot` | `''` | 头像
| `content` | `vSlot` | `''` | 详情
| `interceptTitle` | `number` | `12` | 标题内容截取长度 ( 美化显示 )
| `interceptSummary` | `number` | `24` | 摘要内容截取长度 ( 美化显示 )
