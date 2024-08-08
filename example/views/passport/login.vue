<template>
    <mi-login
        action="/v1/login"
        :captcha-setting="{
            initAction: '/v1/captcha/init',
            verifyAction: '/v1/captcha/verify'
        }" />
</template>