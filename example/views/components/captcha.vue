<template>
    <div style="padding-top: 80px">
        <mi-captcha init-action="/v1/captcha/init" :action-config="{ url: '/v2/captcha/init' }" />
    </div>
</template>