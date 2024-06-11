<template>
    <mi-register
        action="/v1/register"
        :captcha-setting="{
            initAction: '/v1/captcha/init',
            verifyAction: '/v1/captcha/verify'
        }" />
</template>
