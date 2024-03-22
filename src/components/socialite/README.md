# 社会化登录 / 注册

> 「 社会化登录 / 注册 」 组件作用于登录 / 注册表单内，快速定义三方的社会化登录 / 注册的相关内容及 `UI` 效果

## 使用示例

### 默认

```html
<mi-socialite />
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Socialite Tokens

| Token | 默认值
| :---- | :----
| `--mi-socialite-icon` | `--mi-on-background`
| `--mi-socialite-title-text` | `--mi-on-background`
| `--mi-socialite-mobile-line` | `--mi-primary`
| `--mi-socialite-mobile-icon` | `--mi-primary`
| `--mi-socialite-mobile-title-text` | `--mi-surface-variant`
| `--mi-socialite-mobile-title-background-start` | `--mi-primary`
| `--mi-socialite-mobile-title-background-hint` | `--mi-secondary`
| `--mi-socialite-mobile-title-background-stop` | `--mi-tertiary`

## API

### MiSocialite `<mi-socialite>`

#### `MiSocialite` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `tip` | `string` | `''` | 显示文案
| `showMore` | `boolean` | `true` | 更多下拉选单的显示方式 ( 移动端会自动切换 )
| `domain` | `string` | `''` | 社会化登录/注册跳转链接
| `items` | [`DropdownItem`](../dropdown/README.md) | `[]` | 下拉选项
