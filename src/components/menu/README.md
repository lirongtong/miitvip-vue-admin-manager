# 菜单选项

> 「 菜单选项 」 组件为页面和功能提供导航的菜单列表。

## 使用示例

### 默认

```html
<template>
    <mi-menu :items="items" />
</template>

<script setup lang="ts">
    import { reactive, createVNode } from 'vue'
    import { ThunderboltOutlined, FilterOutlined, FireFilled } from '@ant-design/icons-vue'

    const items = reactive([{
        name: 'start',
        path: '/start',
        meta: {
            title: '快速上手',
            subTitle: 'Getting Started',
            icon: createVNode(ThunderboltOutlined),
            tag: { color: '#f50', content: 'Hot' }
        }
    }, {
        name: 'theme',
        path: '/theme',
        meta: {
            title: '主题定制',
            subTitle: 'Custom Theme',
            icon: createVNode(FilterOutlined),
            tag: { icon: createVNode(FireFilled), color: '#ed4014' }
        }
    }])
</script>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Menu Tokens

| Token | 默认值
| :---- | :----
| `--mi-menu-text` | `--mi-on-background`
| `--mi-menu-background` | `--mi-background`
| `--mi-menu-collapsed-tooltip-background` | `--mi-surface-variant`
| `--mi-menu-collapsed-tooltip-text` | `--mi-on-surface-variant`

#### Submenu Tokens

| Token | 默认值
| :---- | :----
| `--mi-menu-submenu-item-title-arrow-default` | `--mi-on-background`
| `--mi-menu-submenu-item-title-arrow-active` | `--mi-on-primary`
| `--mi-menu-submenu-popup-text` | `--mi-on-surface-variant`
| `--mi-menu-submenu-popup-border` | `rgba(--mi-rgb-on-surface-variant, .5)`
| `--mi-menu-submenu-popup-background` | `--mi-surface-variant`

#### MenuItem Tokens

| Token | 默认值
| :---- | :----
| `--mi-menu-item-text` | `--mi-on-background`
| `--mi-menu-item-background-default` | `transparent`
| `--mi-menu-item-background-active-start` | `--mi-primary`
| `--mi-menu-item-background-active-hint` | `--mi-secondary`
| `--mi-menu-item-background-active-stop` | `--mi-tertiary`

#### MenuItemTitle Tokens

| Token | 默认值
| :---- | :----
| `--mi-menu-item-title-text` | `--mi-on-background`
| `--mi-menu-item-title-sub` | `rgba(--mi-rgb-on-background, .5)`
| `--mi-menu-item-title-icon` | `--mi-on-background`
| `--mi-menu-item-title-active-text` | `--mi-on-primary`
| `--mi-menu-item-title-active-sub` | `rgba(--mi-rgb-on-primary, .6)`
| `--mi-menu-item-title-active-icon` | `--mi-on-primary`

## API

### MiMenu `<mi-menu>`

#### `MiMenu` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `indent` | `string \| number \|` [`DeviceSize`](../../utils/README.md) | `16` | 缩进
| `items` | [`MenuItem[]`](../../utils/README.md) | `[]` | 菜单项

### MiSubMenu `<mi-sub-menu>`

#### `MiSubMenu` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `item` | [`MenuItem[]`](../../utils/README.md) | `[]` | 菜单项

### MiMenuItem `<mi-menu-item>`

#### `MiMenuItem` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `item` | [`MenuItem[]`](../../utils/README.md) | `[]` | 菜单项

### MiMenuItemTitle `<mi-menu-item-title>`

#### `MiMenuItemTitle` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `item` | [`MenuItem[]`](../../utils/README.md) | `[]` | 菜单项
| `activeKey` | `string` | `''` | 选中项
