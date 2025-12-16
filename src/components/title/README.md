# 标题设置（MiTitle）

> 「标题设置」组件用于统一页面区块标题的展示样式，支持字号、颜色、间距、对齐方式以及额外操作区域。

## 使用示例

### 基础用法

```html
<mi-title title="默认的标题设置组件效果" />
```

### 标题居中

```html
<mi-title title="默认的标题设置组件效果" :center="true" />
```

### 带操作区（默认插槽）

默认插槽会渲染在标题右侧，适合放按钮、筛选条件等操作区域：

```html
<mi-title title="新增额外内容 - 左右分布显示">
    <button class="btn">Extra 内容</button>
</mi-title>
```

### 自定义字号与颜色

```html
<mi-title
    title="自定义样式标题"
    :size="32"
    color="#ff4d4f"
    :margin="{ top: 16, bottom: 24 }"
/>
```

### 在 TSX / JSX 中使用

```text
import MiTitle from '@/components/title'

export default () => (
    <MiTitle title="标题">
        <button class="btn">操作</button>
    </MiTitle>
)
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Title Tokens

| Token | 默认值 |
| :---- | :---- |
| `--mi-title-undeline-start` | `--mi-primary` |
| `--mi-title-undeline-hint`  | `--mi-secondary` |
| `--mi-title-undeline-stop`  | `--mi-tertiary` |

## API

### 组件：`<mi-title>` / `MiTitle`

#### Props

| 参数     | 类型 | 默认值 | 说明 |
| :------- | :--- | :----- | :--- |
| `title`  | `string` | `''` | 标题文本（支持 HTML 字符串渲染） |
| `center` | `boolean` | `false` | 是否居中显示标题内容 |
| `size`   | `string \| number \|` [`DeviceSize`](../../utils/README.md) | `24` | 标题字号，支持固定像素、响应式设备尺寸配置 |
| `color`  | `string` | `''` | 标题文字颜色（CSS 颜色值） |
| `margin` | [`Position`](../../utils/README.md) | `{}` | 外边距配置，支持 top / right / bottom / left 属性 |

#### Slots

| 插槽名    | 说明 |
| :-------- | :--- |
| `default` | 标题右侧额外内容区域（如按钮、操作入口等），不传则不显示 |
