# 面包屑导航

> 「 面包屑导航 」 组件根据 `route` 路由配置信息自动生成面包屑导航数据

## 使用

### 默认

```html
<mi-breadcrumbs />
```

### 分隔符

```html
<mi-breadcrumbs separator="~" />
```

### 动画效果

```html
<!-- 内置的动画效果请看 animation.module.less -->
<mi-breadcrumbs animation="scale" />
```

## 主题配置

```html
<mi-theme :theme="theme">
    <!-- ... -->
    <mi-breadcrumbs />
</mi-theme>

<script lang="ts" setup>
    import { reactive } from 'vue'

    const theme = reactive({
        components: {
            breadcrumbs: {
                text: {
                    default: '#000',
                    active: '#fff'
                },
                separator: '#333'
            }
        }
    })
</script>
```

### Tokens

| Token | 默认值
| :---- | :----
| `--mi-breadcrumbs-text-default` | `--mi-on-surface-variant`
| `--mi-breadcrumbs-text-active` | `--mi-primary`
| `--mi-breadcrumbs-separator` | `--mi-on-surface-variant`

## API

### `MiBreadcrumbs` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `separator` | `string` | `/` | 分隔符
| `animation` | `string` | `breadcrumb` | 动画效果
