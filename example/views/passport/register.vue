<template>
    <mi-register :action="api.register"
        :background="bg"
        :email-verify-action="api.validator.email"
        :username-verify-action="api.validator.name" />
</template>

<script setup>
import bg from '@images/login-bg.jpg'
</script>