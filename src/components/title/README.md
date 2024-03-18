# 标题设置

> 「 标题设置 」 组件制定标题显示的统一风格。

## 使用示例

### 默认

```html
<mi-title title="默认的标题设置组件效果" />
```

### 居中

```html
<mi-title title="默认的标题设置组件效果" :center="true" />
```

### 额外自定义内容

```html
<mi-title title="新增额外内容 - 左右分布显示">
    <div class="btn">Extra 内容</div>
</mi-title>
```

## 主题配置

```html
<mi-theme :theme="theme">
    <!-- ... -->
    <mi-title title="默认的标题设置组件效果" />
</mi-theme>

<script lang="ts" setup>
    import { reactive } from 'vue'

    const theme = reactive({
        components: {
            title: {
                undeline: {
                    start: '#333',
                    // ...
                },
                // ...
            }
        }
    })
</script>
```

### Tokens

#### Title Tokens

| Token | 默认值
| :---- | :----
| `--mi-title-undeline-start` | `--mi-primary`
| `--mi-title-undeline-hint` | `--mi-secondary`
| `--mi-title-undeline-stop` | `--mi-tertiary`

## API

### MiTitle `<mi-title>`

#### `MiTitle` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `title` | `string` | `''` | 标题
| `center` | `boolean` | `false` | 是否居中
| `size` | `string \| number \| DeviceSize` | `24` | 大小
| `color` | `string` | `''` | 颜色
| `extra` | `vSlot` | `''` | 自定义内容

#### Interface `DeviceSize` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `laptop` | `string \| number` | `''` | 电脑端
| `mobile` | `string \| number` | `''` | 移动端
| `tablet` | `string \| number` | `''` | 平板端
