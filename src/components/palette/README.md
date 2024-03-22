# 调色板

> 「 调色板 」 组件为「 主题定制 」功能而开发。

## 使用示例

### 默认

```html
<mi-palette />
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Palette Tokens

| Token | 默认值
| :---- | :----
| `--mi-palette-text` | `--mi-on-surface-variant`
| `--mi-palette-background` | `--mi-surface-variant`
| `--mi-palette-border` | `--mi-surface-variant`
| `--mi-palette-btn-border` | `rgba(--mi-rgb-on-surface-variant, 0.5);`
| `--mi-palette-btn-text` | `--mi-on-surface-variant`
| `--mi-palette-btn-save-color` | `--mi-on-primary`
| `--mi-palette-btn-save-start` | `--mi-primary`
| `--mi-palette-btn-save-hint` | `--mi-secondary`
| `--mi-palette-btn-save-stop` | `--mi-tertiary`

## API

### MiPalette `<mi-palette>`

#### `MiPalette` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `trigger` | `string` | `click` | 触发方式
| `placement` | `string` | `bottom` | 弹出位置
