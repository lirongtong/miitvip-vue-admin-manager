# 滑块验证码

> 「 滑块验证码 」 组件常用于各种表单提交前的验证

## 使用示例

### 默认

```html
<mi-captcha />
```

### 初始化校验

> 初始化失败将不进行弹窗校验等后续动作。

```html
<template>
    <!-- api ( string ) -->
    <mi-captcha init-action="/v1/captcha/init" />

    <!-- action ( function ) -->
    <mi-captcha :init-action="() => handleInitAction()" />
</template>

<script setup lang="ts">
const handleInitAction = () => {
    // do something
    return true
}
</script>
```

### 自定义背景底图

```html
<template>
    <mi-captcha :image="background" />
</template>

<script setup lang="ts">
import background from '@/assets/images/captcha-background.png'
</script>
```

### 弹窗前的校验

> 验证码弹窗前的校验, `true` 的情况下可直接免弹窗通过验证。

```html
<template>
    <!-- api ( string ) -->
    <mi-captcha check-action="/v1/captcha/check" />

    <!-- action ( function ) -->
    <mi-captcha :check-action="() => handleCheckAction()" />
</template>

<script setup lang="ts">
const handleCheckAction = () => {
    // do something
    return true
}
</script>
```

### 结果校验

> 结合「`initAction`」初始化动作得到的配置项，对结果进行自定义校验。

```html
<template>
    <!-- api ( string ) -->
    <mi-captcha verify-action="/v1/captcha/verify" />

    <!-- action ( function ) -->
    <mi-captcha :verify-action="() => handleVerifyAction()" />
</template>

<script setup lang="ts">
const handleVerifyAction = () => {
    // do something
    // ...
    // return true or error message
    return true
}
</script>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Captcha Tokens

| Token | 默认值
| :---- | :----
| `--mi-captcha-radar-border` | `--mi-primary`
| `--mi-captcha-radar-text` | `--mi-on-surface`
| `--mi-captcha-radar-ready-background-start` | `--mi-surface`
| `--mi-captcha-radar-ready-background-stop` | `--mi-surface-variant`
| `--mi-captcha-radar-ring` | `--mi-primary`
| `--mi-captcha-radar-dot` | `--mi-primary`
| `--mi-captcha-radar-scan-border` | `--mi-primary`
| `--mi-captcha-radar-success-icon` | `--mi-primary`
| `--mi-captcha-radar-success-background` | `rgba(--mi-rgb-primary, .2)`

#### Captcha Modal Tokens

| Token | 默认值
| :---- | :----
| `--mi-captcha-modal-arrow-border-in` | `--mi-surface-variant`
| `--mi-captcha-modal-arrow-border-out` | `--mi-primary`
| `--mi-captcha-modal-content-border` | `--mi-primary`
| `--mi-captcha-modal-content-shadow` | `--mi-surface`
| `--mi-captcha-modal-content-background-start` | `--mi-surface`
| `--mi-captcha-modal-content-background-stop` | `--mi-surface-variant`
| `--mi-captcha-modal-content-loading-text` | `--mi-on-surface`
| `--mi-captcha-modal-content-loading-background-start` | `--mi-surface`
| `--mi-captcha-modal-content-loading-background-stop` | `--mi-surface-variant`
| `--mi-captcha-modal-content-loading-spinner` | `--mi-primary`
| `--mi-captcha-modal-content-result-text` | `--mi-on-surface`
| `--mi-captcha-modal-content-result-success-text` | `--mi-on-tertiary`
| `--mi-captcha-modal-content-result-success-background` | `--mi-tertiary`
| `--mi-captcha-modal-content-result-error-text` | `--mi-on-error`
| `--mi-captcha-modal-content-result-error-background` | `--mi-error`
| `--mi-captcha-modal-content-slider-background` | `--mi-on-surface`
| `--mi-captcha-modal-content-slider-text` | `--mi-surface`
| `--mi-captcha-modal-content-slider-btn-border` | `--mi-primary`
| `--mi-captcha-modal-content-slider-btn-shadow` | `--mi-surface`
| `--mi-captcha-modal-content-slider-btn-scan-background` | `--mi-surface`
| `--mi-captcha-modal-content-slider-btn-scan-line` | `--mi-surface`
| `--mi-captcha-modal-content-panel-icon` | `--mi-on-surface`
| `--mi-captcha-modal-content-panel-copyright-border` | `--mi-primary`
| `--mi-captcha-modal-content-panel-border` | `rgba(--mi-rgb-primary, .1)`
| `--mi-captcha-modal-mask` | `rgba(--mi-rgb-primary, .1)`

## API

### MiCaptcha `<mi-captcha>`

#### `MiCaptcha` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `width` | `string \| number \|` [`DeviceSize`](../../utils/README.md) | `320` | 触发按钮的宽度
| `height` | `string \| number \|` [`DeviceSize`](../../utils/README.md) | `''` | 触发按钮的高度
| `radius` | `string \| number \|` [`DeviceSize`](../../utils/README.md) | `48` | 触发按钮的圆角弧度
| `visible` | `boolean` | `true` | 是否显示初始触发按钮
| `color` | `string` | `undefined` | 主题色
| `image` | `string` | `undefined` | 弹窗底图
| `logo` | `string` | `undefined` | 触发按钮内右侧的图标
| `link` | `string` | `undefined` | 图标对应的链接地址
| `offset` | `number` | `2` | 本地校验偏差值 - 单位 px ( 可设定 2 - 5 )
| `mask` | `boolean` | `true` | 是否显示遮罩
| `maskClosable` | `boolean` | `true` | 遮罩是否可以点击关闭弹窗
| `boxShadow` | `boolean` | `true` | 是否显示阴影
| `maxTries` | `number` | `5` | 最大的错误尝试次数
| `initParams` | `object` | `{}` | 初始化配置参数
| `initMethod` | `string` | `get` | 初始化远程接口请求方式
| `initAction` | `string \| function` | `''` | 初始化动作处理
| `checkParams` | `object` | `{}` | 弹窗前的校验配置参数
| `checkMethod` | `string` | `get` | 弹窗前的校验接口请求方式
| `checkAction` | `string \| function` | `''` | 弹窗前的校验动作处理
| `verifyParams` | `object` | `{}` | 验证码校验配置参数
| `verifyMethod` | `string` | `get` | 验证码远程接口请求方式
| `verifyAction` | `string \| function` | `''` | 验证码校验的动作处理
| `actionConfig` | [`AxiosRequestConfig`](https://axios-http.com/zh/docs/req_config) | `{}` | 远程接口的通用配置参数

#### `MiCaptcha` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `init` | [`ResponseData`](../../utils/README.md) \| *None*  | 初始化后的回调事件
| `checked` | [`ResponseData`](../../utils/README.md) \| *None* | 弹窗前的校验后的回调事件
| `success` | [`ResponseData`](../../utils/README.md) \| *None* | 验证码校验成功后的回调事件
