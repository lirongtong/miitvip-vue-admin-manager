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

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Quote Tokens

| Token | 默认值
| :---- | :----
| `--mi-quote-text` | `--mi-on-secondary`
| `--mi-quote-background-start` | `--mi-primary`
| `--mi-quote-background-hint` | `--mi-secondary`
| `--mi-quote-background-stop` | `--mi-tertiary`
| `--mi-quote-btn-gradient-start` | `--mi-surface`
| `--mi-quote-btn-gradient-stop` | `--mi-surface-variant`
| `--mi-quote-btn-text` | `--mi-on-surface-variant`
| `--mi-quote-btn-border` | `transparent`
| `--mi-quote-btn-shadow` | `--mi-shadow`

## API

### MiQuote `<mi-quote>`

#### `MiQuote` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `background` | `string` | `''` | 背景色
| `color` | `string` | `''` | 文案颜色
