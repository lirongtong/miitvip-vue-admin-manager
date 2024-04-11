<template>
    <div style="padding: 2rem">
        <mi-notice :width="320"
            :dot="false"
            :amount="1"
            :icon-setting="{ size: 20 }"
            :tabs="['系统消息', '私信', '个人', '团队', '系统消息', '私信', '个人', '团队']"
            :items="[[{
                key: 0,
                title: '回复提醒',
                content: `您好，关于「 Captcha 」组件更加人性化的定制方案已收到，我们近期将按需完善此组件功能。`
            }], [{
                key: 0,
                title: '注册成功',
                content: `您好，关于「 Captcha 」组件更加人性化的定制方案已收到，我们近期将按需完善此组件功能。`
            }], [{
                key: 0,
                title: '注册成功',
                content: `您好，关于「 Captcha 」组件更加人性化的定制方案已收到，我们近期将按需完善此组件功能。`
            }], [{
                key: 0,
                title: '注册成功',
                content: `您好，关于「 Captcha 」组件更加人性化的定制方案已收到，我们近期将按需完善此组件功能。`
            }]]" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref('0')
</script>