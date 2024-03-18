# 引用说明

> 「 引用说明 」 组件将重要内容或引用内容，采用额外的显眼的样式进行说明，突出重要性。

## 使用示例

### 默认

```html
<mi-quote>
    当前内容所处区域即为「 引用说明 」组件效果
</mi-quote>
```

## 主题配置

```html
<mi-theme :theme="theme">
    <!-- ... -->
    <mi-quote>引用内容</mi-quote>
</mi-theme>

<script lang="ts" setup>
    import { reactive } from 'vue'

    const theme = reactive({
        components: {
            quote: {
                text: '#333',
                // ...
            }
        }
    })
</script>
```

### Tokens

#### Quote Tokens

| Token | 默认值
| :---- | :----
| `--mi-quote-text` | `--mi-on-secondary`
| `--mi-quote-background-start` | `--mi-primary`
| `--mi-quote-background-hint` | `--mi-secondary`
| `--mi-quote-background-stop` | `--mi-tertiary`

## API

### MiQuote `<mi-quote>`

#### `MiQuote` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `background` | `string` | `''` | 背景色
| `color` | `string` | `''` | 文案颜色
