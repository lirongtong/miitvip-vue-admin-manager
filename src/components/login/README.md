# 登录页面

> 「 登录页面 」 组件用于快速生成登录表单，属于「 重型组件 」，一个组件相当于一个页面

## 使用示例

### 默认

```html
<mi-login action="/v1/login" />
```

### 自定义表单

```html
<mi-login action="/v1/login">
    <template #content>
        <a-form>
            <a-form-item>
                <!-- ... -->
            </a-form-item>
        </a-form>
    </template>
</mi-login>
```

### 自定义表单校验

```html
<template>
    <mi-login action="/v1/login" :rules="rules" />
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

### 快捷登录方式

```html
<template>
    <mi-login action="/v1/login" :socialite-setting="{items, domain}" />
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
    <mi-login :action="() => handleLogin()" />
</template>

<script setup lang="ts">
import type { LoginFormParams } from '@miitvip/admin-pro'

const handleLogin = (data?: LoginFormParams) => {
    console.log('sign in')
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

#### Login Tokens

| Token | 默认值
| :---- | :----
| `--mi-login-logo-border` | `--mi-primary`
| `--mi-login-form-input-border` | `--mi-primary`
| `--mi-login-form-text` | `--mi-on-surface`
| `--mi-login-form-error` | `--mi-error`
| `--mi-login-form-btn-default-text` | `--mi-on-surface`
| `--mi-login-form-btn-default-start` | `--mi-surface`
| `--mi-login-form-btn-default-stop` | `--mi-surface-variant`
| `--mi-login-form-btn-active-start` | `--mi-primary`
| `--mi-login-form-btn-active-hint` | `--mi-secondary`
| `--mi-login-form-btn-active-stop` | `--mi-tertiary`
| `--mi-login-form-btn-active-text` | `--mi-surface`
| `--mi-login-mask` | `rgba(--mi-rgb-surface-variant, .5)`

## API

### MiLogin `<mi-login>`

#### `MiLogin` 属性 ( `Properties` )

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
| `registerLink` | `string` | `/register` | 注册链接
| `forgetPasswordLink` | `string` | `/forget` | 忘记密码链接
| `socialiteLogin` | `boolean` | `false` | 是否是社会化登录的回调状态
| `socialiteSetting` | [`SocialiteProperties`](../socialite/README.md) | `{}` | 社会化登录组件配置

#### `MiLogin` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `captchaInit` | *None* | 验证码初始化后的回调事件
| `captchaChecked` | *None* | 验证码弹窗开启前的校验回调事件
| `captchaSuccess` | *None* | 验证码校验成功后的回调事件
| `afterLogin` | *None* | 登录成功后的回调事件
