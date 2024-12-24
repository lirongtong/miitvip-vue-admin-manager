# 图片加载

> 「 图片加载 」 重新封装 `img` 标签，新增 load 事件处理。

## 使用示例

### 基础

```html
<mi-image src="https://images.makeit.vip/image.png" alt="makeit" />
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

## API

### MiImage `<mi-image>`

#### `MiImage` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `src` | `string` | `''` | 图片地址
| `alt` | `string` | `''` | 图片描述
| `width` | `number \| string \|` [`DeviceSize`](../../utils/README.md#interface-devicesize) | `''` | 宽度
| `height` | `number \| string \|` [`DeviceSize`](../../utils/README.md#interface-devicesize) | `''` | 高度
| `radius` | `number \| string \|` [`DeviceSize`](../../utils/README.md#interface-devicesize) | `''` | 圆角

#### `MiImage` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `load` | element | 加载完成后返回当前元素
