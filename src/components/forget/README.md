# 忘记密码

> 「 忘记密码 」 组件用于快速生成重置密码的操作页面，属于「 重型组件 」，一个组件相当于一个页面

## 使用示例

### 默认

```html
<mi-forget send-code-action="/v1/password/captcha/send" check-code-action="/v1/password/captcha/verify" reset-password-action="/v1/password/update" />
```

### 自定义表单

```html
<mi-forget send-code-action="/v1/password/captcha/send" check-code-action="/v1/password/captcha/verify" reset-password-action="/v1/password/update">
    <template #content>
        <a-form>
            <a-form-item>
                <!-- ... -->
            </a-form-item>
        </a-form>
    </template>
</mi-forget>
```

### 自定义表单校验

```html
<template>
    <mi-forget send-code-action="/v1/password/captcha/send" check-code-action="/v1/password/captcha/verify" reset-password-action="/v1/password/update" :rules="rules" />
</template>

<script setup lang="ts">
    import { reactive } from 'vue'

    const validateCaptcha = (_rule: any, value: string) => {
        // do something
        // return Promise.resolve()
    }

    const rules = reactive({
        username: [{
            required: true,
            message: '请输入用户名 / 邮箱地址 / 手机号码',
            trigger: 'blur'
        }],
        captcha: [{
            required: true,
            validator: validateCaptcha
        }]
    })
</script>
```

### 自定义校验逻辑

```html
<template>
    <mi-forget
        :send-code-action="() => handleSendCode()"
        :check-code-action="() => handleCheckCode()"
        :reset-password-action="() => handleResetPassword()" />
</template>

<script setup lang="ts">
import type { ForgetFormParams, ForgetCodeParams, ForgetUpdateFormParams } from '@miitvip/admin-pro'

const handleSendCode = (data?: ForgetFormParams) => {
    console.log('send code')
    // do sometion
    // return `boolean` or `string - ( error message )`
    return true
}

const handleCheckCode = (data?: ForgetCodeParams) => {
    console.log('check code')
    // do sometion
    // return `boolean` or `string - ( error message )`
    return true
}

const handleResetPassword = (data?: ForgetUpdateFormParams) => {
    console.log('reset password')
    // do sometion
    // return `boolean` or `string - ( error message )`
    return `重置失败，请稍后再试`
}
</script>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Forget Tokens

| Token | 默认值
| :---- | :----
| `--mi-forget-logo-border` | `--mi-primary`
| `--mi-forget-form-input-border` | `--mi-primary`
| `--mi-forget-form-text` | `--mi-on-surface`
| `--mi-forget-form-error` | `--mi-error`
| `--mi-forget-form-btn-default-text` | `--mi-on-surface`
| `--mi-forget-form-btn-default-start` | `--mi-surface`
| `--mi-forget-form-btn-default-stop` | `--mi-surface-variant`
| `--mi-forget-form-btn-active-start` | `--mi-primary`
| `--mi-forget-form-btn-active-hint` | `--mi-secondary`
| `--mi-forget-form-btn-active-stop` | `--mi-tertiary`
| `--mi-forget-form-btn-active-text` | `--mi-surface`
| `--mi-forget-form-resend-btn-start` | `--mi-primary`
| `--mi-forget-form-resend-btn-hint` | `--mi-secondary`
| `--mi-forget-form-resend-btn-stop` | `--mi-tertiary`
| `--mi-forget-form-resend-btn-text` | `--mi-surface`
| `--mi-forget-mask` | `rgba(--mi-rgb-surface-variant, .5)`

## API

### MiForget `<mi-forget>`

#### `MiForget` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `title` | `string` | `''` | 标题
| `video` | `string` | `''` | 视频背景 ( 优先级高于 `background` )
| `background` | `string` | `默认图` | 图片背景
| `rules` | `object` | `{}` | 表单自定义校验规则
| `content` | `vSlot` | `''` | 自定义表单内容区域
| `footer` | `vSlot` | `''` | 自定义页脚
| `captcha` | `boolean` | `true` | 是否开启验证码
| `captchaSetting` | [`CaptchaProperties`](../captcha/README.md) | `{}` | 验证码配置 ( 开启验证码后有效 )
| `redirectTo` | `string` | `/login` | 密码更新成功后的跳转地址
| `loginLink` | `string` | `/login` | 登录地址
| `registerLink` | `string` | `/register` | 注册地址
| `sendCodeParams` | `object` | `{}` | 发送验证码的参数配置
| `sendCodeMethod` | `string` | `post` | 发送验证码的请求方式
| `sendCodeAction` | `string \| Function` | `''` | 发送验证码的接口地址或逻辑处理方法 ( 必填 )
| `checkUsernameParams` | `object` | `{}` | 校验输入框内容的参数配置
| `checkUsernameMethod` | `string` | `post` | 校验输入框内容的请求方式
| `checkUsernameAction` | `string \| Function` | `''` | 校验输入框内容的接口地址或逻辑处理方法
| `checkCodeParams` | `object` | `{}` | 校验验证码的参数配置
| `checkCodeMethod` | `string` | `post` | 校验验证码的请求方式
| `checkCodeAction` | `string \| Function` | `''` | 校验验证码的接口地址或逻辑处理方法 ( 必填 )
| `resetPasswordParams` | `object` | `{}` | 重置密码的参数配置
| `resetPasswordMethod` | `string` | `put` | 重置密码的请求方式
| `resetPasswordAction` | `string \| Function` | `''` | 重置密码的接口地址或逻辑处理方法 ( 必填 )
| `resendDowntime` | `number` | `120` | 重新发送验证码倒计时时长

#### `MiForget` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `captchaInit` | *None* | 验证码初始化后的回调事件
| `captchaChecked` | *None* | 验证码弹窗开启前的校验回调事件
| `captchaSuccess` | *None* | 验证码校验成功后的回调事件
