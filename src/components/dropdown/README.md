# 下拉菜单

> 「 下拉菜单 」 组件多用于页面操作选项过多时，用此组件收纳操作元素，点击或移入触发点，显示下拉选单，选择对应的菜单项即可执行相应的指令。

## 使用示例

### 默认

```html
<template>
    <mi-dropdown :items="items" />
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import type { DropdownItem } from '@miitvip/admin-pro'
    import { message } from 'ant-design-vue'
    import { UserOutlined, SettingOutlined, FireFilled } from '@ant-design/icons-vue'

    // items 更多配置选项请参考: type DropdownItem
    const items = ref<Partial<DropdownItem>>(
        [{
            name: 'personal',
            title: '个人中心',
            icon: UserOutlined,
            tag: { content: 'Hot' },
            callback: () => message.info('点击了「个人中心」菜单')
        }, {
            name: 'setting',
            title: '系统设置',
            icon: SettingOutlined,
            tag: { icon: FireFilled }
        }]
    )
</script>
```

### 自定义菜单

```html
<mi-dropdown>
    <template v-slot:overlay>
        <ul>
            <li>自定义菜单一</li>
            <li>自定义菜单二</li>
        </ul>
    </template>
</mi-dropdown>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Dropdown Item Tokens

| Token | 默认值
| :---- | :----
| `--mi-dropdown-item-text` | `--mi-on-surface`
| `--mi-dropdown-item-tag-text` | `--mi-surface`
| `--mi-dropdown-item-tag-start` | `--mi-primary`
| `--mi-dropdown-item-tag-hint` | `--mi-secondary`
| `--mi-dropdown-item-tag-stop` | `--mi-tertiary`

## API

### MiDropdown `<mi-dropdown>`

#### `MiDropdown` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `title` | `string \| vSlot` | `Avatar` | 下拉菜单的触发点
| `placement` | `string` | `bottom` | 弹窗打开位置 `['top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'leftTop', 'leftBottom', 'rightTop', 'rightBottom']`
| `trigger` | `string` | `click` | 触发方式 `['click', 'hover', 'focus', 'contextmenu']`
| `items` | [`DropdownItem`](../../utils/README.md) | `[]` | 菜单选项
| `overlay` | `vSlot` | `''` | 自定义菜单

### MiDropdownItem `<mi-dropdown-item>`

#### `MiDropdownItem` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `item` | [`DropdownItem`](../../utils/README.md) | `{}` | 下拉菜单的触发点
