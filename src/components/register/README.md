# 注册页面

> 「 注册页面 」 组件用于快速生成注册表单，属于「 重型组件 」，一个组件相当于一个页面

## 使用示例

### 默认

```html
<mi-register action="/v1/register" />
```

### 自定义表单

```html
<mi-register action="/v1/register">
    <template #content>
        <a-form>
            <a-form-item>
                <!-- ... -->
            </a-form-item>
        </a-form>
    </template>
</mi-register>
```

### 自定义表单校验

```html
<template>
    <mi-register action="/v1/register" :rules="rules" />
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
            message: '请输入用户名',
            trigger: 'blur'
        }],
        captcha: [{
            required: true,
            validator: validateCaptcha
        }]
    })
</script>
```

### 快捷注册方式

```html
<template>
    <mi-register action="/v1/register" :socialite-setting="{items, domain}" />
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue'
    import { GithubOutlined } from '@ant-design/icons-vue'

    const domain = ref<string>('https://account.makeit.vip/v1/oauth')
    const items = reactive({
        name: 'github',
        icon: createVNode(GithubOutlined)
        callback: () => {}
    }, {
        // ...
    })
</script>
```

### 自定义校验逻辑

```html
<template>
    <mi-register :action="() => handleRegister()" />
</template>

<script setup lang="ts">
import type { RegisterFormParams } from '@miitvip/admin-pro'

const handleRegister = (data?: RegisterFormParams) => {
    console.log('sign up')
    // do sometion
    // return `boolean` or `string - ( error message )`
    return true
}
</script>
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Register Tokens

| Token | 默认值
| :---- | :----
| `--mi-register-text` | `--mi-on-surface`
| `--mi-register-logo-border` | `--mi-primary`
| `--mi-register-tip-important` | `--mi-error`
| `--mi-register-form-input-border` | `--mi-primary`
| `--mi-register-form-error` | `--mi-error`
| `--mi-register-form-btn-default-start` | `--mi-surface`
| `--mi-register-form-btn-default-stop` | `--mi-surface-variant`
| `--mi-register-form-btn-default-text` | `--mi-on-surface`
| `--mi-register-form-btn-active-start` | `--mi-primary`
| `--mi-register-form-btn-active-hint` | `--mi-secondary`
| `--mi-register-form-btn-active-stop` | `--mi-tertiary`
| `--mi-register-form-btn-active-text` | `--mi-surface`
| `--mi-register-mask` | `rgba(--mi-rgb-surface-variant, .5)`

## API

### MiRegister `<mi-register>`

#### `MiRegister` 属性 ( `Properties` )

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
| `action` | `string \| function` | `''` | 登录动作 ( 必填 )
| `redirectTo` | `string` | `/` | 注册成功后的跳转地址
| `passwordSetting` | [`PasswordProperties`](../password/README.md) | `{}` | 密码组件配置
| `loginLink` | `string` | `/login` | 登录地址
| `socialiteSetting` | [`SocialiteProperties`](../socialite/README.md) | `{}` | 社会化登录组件配置
| `verify` | [`RegisterVerifyProperties`](#interface-registerverifyproperties) | `{}` | 用户名 & 邮箱的远程校验 ( `Blur` 触发 )
| `usernameTip` | `vSlot` | `''` | 用户名 `Focus` 提示语

#### Interface `RegisterVerifyProperties`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `username` | [`VerifyConfig`](#interface-verifyconfig) | 用户名
| `email` | [`VerifyConfig`](#interface-verifyconfig) | 邮箱

#### Interface `VerifyConfig`

| 参数 | 类型 | 说明
| :---- | :---- | :----
| `action` | `string \| Function` | 动作
| `params` | `object` | 参数
| `method` | `string` | 方式

#### `MiRegister` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `captchaInit` | *None* | 验证码初始化后的回调事件
| `captchaChecked` | *None* | 验证码弹窗开启前的校验回调事件
| `captchaSuccess` | *None* | 验证码校验成功后的回调事件
| `afterLogin` | *None* | 登录成功后的回调事件
