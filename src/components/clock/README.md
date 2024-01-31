# 在线钟表

> 「 在线钟表 」 组件纯属娱乐, 观赏用

## 使用

### 默认状态

```html
<mi-clock />
```

### 宽度设置

```html
<!-- 默认 240 -->
<mi-clock :width="320" />
```

## 主题配置

```html
<mi-theme :theme="theme">
    <!-- ... -->
    <mi-layout>
        <mi-clock />
    </mi-layout>
</mi-theme>

<script lang="ts" setup>
    import { reactive } from 'vue'

    const theme = reactive({
        components: {
            clock: {
                shadow: '#fff',
                minute: {
                    text: '#fff'
                },
                // ...
            }
        }
    })
</script>
```

### Tokens

#### Clock Tokens

| Token | 默认值
| :---- | :----
| `--mi-clock-shadow` | `--mi-shadow`
| `--mi-clock-background-color` | `--mi-surface`
| `--mi-clock-background-gradient-start` | `--mi-surface`
| `--mi-clock-background-gradient-stop` | `--mi-surface-variant`
| `--mi-clock-hour-text` | `--mi-on-surface`
| `--mi-clock-minute-text` | `--mi-on-surface`
| `--mi-clock-minute-line` | `--mi-on-surface`
| `--mi-clock-pointer-background` | `--mi-on-surface`
| `--mi-clock-pointer-mid` | `--mi-primary`
| `--mi-clock-pointer-top` | `--mi-shadow`
| `--mi-clock-point-background` | `--mi-on-surface`
| `--mi-clock-point-hour` | `--mi-on-surface`
| `--mi-clock-point-minute` | `--mi-on-surface`
| `--mi-clock-point-second` | `--mi-primary`

## API

### MiClock `<mi-clock>`

#### `MiClock` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `width` | `string \| number \| DeviceSize` | `240` | 宽度
