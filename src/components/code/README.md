# 代码高亮

> 集成轻量且优雅的语法高亮库「 `prismjs` 」
>
> 「 `HTML` 」及「 `JS` 」无需额外引入，直接使用即可
>
> 其他语言的高亮显示，需要引入对应的语言组件，所有组件文件在「 `node_modules/prismjs/components/**` 」

## 使用示例

### 默认

```html
<!-- python -->
<template>
    <mi-code language="python" :content="code" />
</template>

<script setup lang="ts">
    import 'prismjs/components/prism-python.js'

    const code = `
import time

# 格式化显示时间
def getTime():
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

# .......
`
</script>
```

## 主题配置

```html
<template>
    <mi-theme :theme="theme">
        <!-- ... -->
        <mi-layout>
            <mi-code :content="code" />
        </mi-layout>
    </mi-theme>
</template>

<script lang="ts" setup>
    import { reactive } from 'vue'

    const theme = reactive({
        components: {
            code: {
                scrollbar: '#fff',
                background: '#000',
                // ...
            }
        }
    })

    const code = `
<template>
    <mi-captcha />
</template>
`
</script>
```

### Tokens

#### Clock Tokens

| Token | 默认值
| :---- | :----
| `--mi-code-scrollbar` | `--mi-primary`
| `--mi-code-background` | `--mi-background`
| `--mi-code-border` | `--mi-background`
| `--mi-code-dot-red` | `--mi-primary`
| `--mi-code-dot-orange` | `--mi-secondary`
| `--mi-code-dot-green` | `--mi-tertiary`

## API

### MiCode `<mi-code>`

#### `MiCode` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `language` | `string` | `html` | 语言
| `content` | `string \| vSlot` | `''` | 内容
