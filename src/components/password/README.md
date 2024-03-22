# 密码设置

> 「 密码设置 」 组件作用于表单内，快速定义密码设定的相关内容及 `UI` 效果

## 使用示例

### 默认

```html
<template>
    <mi-password v-model="password" @change="handleChange" />
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    
    const password = ref<string>('')

    const handleChange = (value: string) => {
        // do something
        console.log(value)
    }
</script>
```

### 再次确认

```html
<template>
    <mi-password v-model="password" v-model:confirm-value="confirm" :confirm="true" @change="handleChange" @confirm-change="handleConfirmChange" />
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    
    const password = ref<string>('')
    const confirm = ref<string>('')

    const handleChange = (value: string) => {
        // do something
        console.log(value, password.value)
    }

    const handleConfirmChange = (value: string) => {
        // do something
        console.log(value, confirm.value)
    }
</script>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Password Tokens

| Token | 默认值
| :---- | :----
| `--mi-password-input-border` | `--mi-primary`
| `--mi-password-strength-item-error` | `--mi-error`
| `--mi-password-strength-item-success` | `--mi-primary`
| `--mi-password-strength-item-tips` | `--mi-primary`
| `--mi-password-strength-item-background-active` | `--mi-primary`
| `--mi-password-strength-item-background-default` | `--mi-outline`

## API

### MiPassword `<mi-password>`

#### `MiPassword` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `width` | `string \| number \|` [`DeviceSize`](../../utils/README.md) | `100%` | 输入框宽度
| `height` | `string \| number \|` [`DeviceSize`](../../utils/README.md) | `42` | 输入框高度
| `radius` | `string \| number \|` [`DeviceSize`](../../utils/README.md) | `42` | 输入框圆角弧度
| `value ( v-model )` | `string \| number` | `''` | 密码值
| `skipCheck` | `boolean` | `false` | 跳过密码校验 ( 仅生成密码框 )
| `min` | `number` | `6` | 密码值最低长度
| `max` | `number` | `32` | 密码值最大长度
| `complexity` | `boolean` | `true` | 是否为复杂密码
| `complexityTip` | `string` | `需包含字母、数字及特殊字符两种或以上组合` | 复杂密码提示语
| `confirm` | `boolean` | `false` | 是否需要再次输入确认密码
| `confirmValue  ( v-model )` | `string \| number` | `''` | 确认密码值
| `level` | `object` | `{ 0: '弱不禁风', 1: '平淡无奇', 2: '出神入化', 3: '登峰造极' }` | 等级提示语
| `rules` | `object` | `{}` | 输入框校验规则 `Form Rules`
| `placement` | `string` | `top` | 提示语弹窗弹出位置
| `isRequired` | `boolean` | `false` | 是否必填 ( 针对 `skipCheck` 生成独立的密码框, 触发校验 )

#### `MiPassword` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `change` | *None* | 密码输入框值变化的事件回调
| `confirmChange` | *None* | 确认输入框的变化事件回调
