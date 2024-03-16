# 主题配置

> 「 主题配置 」 组件为系统内置组件，无需额外引入，用于配置整站的主题色及各个组件的 `tokens` 配置。

## 使用示例

### 默认

```html
<template>
    <mi-theme :theme="theme">
        <mi-layout>
            <!-- ... -->
        </mi-layout>
    </mi-theme>
</template>

<script lang="ts" setup>
    import { reactive } from 'vue'

    const theme = reactive({
        theme: 'light',
        primary: '#f00',
        radius: 8,
        components: {
            layout: {},
            notice: {}
            // ...
        }
    })
</script>
```

## API

### MiTheme `<mi-theme>`

#### `MiTheme` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `theme` | `object` | `{}` | 主题配置
