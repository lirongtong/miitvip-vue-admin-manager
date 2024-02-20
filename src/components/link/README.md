# 链接

> 「 链接 」 组件用于快速生成 `a` 标签链接，根据传入的 `path` 属性，区分是内部跳转（不携带协议的地址）或是外部跳转地址，同时可用于邮箱类型的快速生成（`type="email"`）

## 使用示例

### 默认

```html
<mi-link path="/">首页</mi-link>
```

### 参数

```html
<mi-link path="/" :query="{keyword: 'makeit admin pro'}">首页</mi-link>
```

### 邮箱

```html
<mi-link path="makeit@makeit.vip" type="email" />
```

## API

### MiLink `<mi-link>`

#### `MiLink` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `type` | `string` | `''` | 类型 `['email']`
| `path` | `string` | `''` | 链接地址
| `query` | `object` | `{}` | 参数配置
| `vertical` | `boolean` | `false` | 是否垂直排列
