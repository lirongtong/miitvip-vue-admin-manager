# 主题配置

> 「 主题配置 」 组件为系统内置组件，无需额外引入，用于配置整站的主题色及各个组件的 `tokens` 配置。

## 使用示例

### 全局主题配置

```html
<template>
    <!-- 全局提供, 入口处一次性载入 -->
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
            layout: {
                // ...
            },
            notice: {
                // ...
            },
            captcha: {
                radar: {
                    // ...
                },
                // ...
            }
            // ...
        }
    })
</script>
```

### 单独主题配置

```html
<template>
    <!-- 任何地方可调用该组件， 针对组件的主题配置 -->
    <mi-theme-provider :tokens="tokens">
        <mi-captcha />
    </mi-theme-provider>
</template>

<script lang="ts" setup>
    import { reactive } from 'vue'

    const tokens = reactive({
        captcha: {
            radar: {
                border: '#fff',
                dot: 'red',
                // ...
            },
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
| `theme` | [`ThemeTokens`](./tokens.ts) | `{}` | 主题配置

### MiThemeProvider `<mi-theme-provider>`

#### `MiThemeProvider` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `tokens` | [`ComponentTokens`](./tokens.ts) | `{}` | 组件主题配置
