# 登录页面

> 「 登录页面 」 组件用于快速生成登录表单，属于「 重型组件 」，一个组件相当于一个页面。

## 使用示例

### 默认

```html
<mi-login action="/v1/login" />
```

### 自定义表单字段校验

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

### 自定义整个表单

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

### 快捷登录方式

```html
<template>
    <mi-login action="/v1/login" :socialite-items="items" :socialite-domain="domain" />
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
