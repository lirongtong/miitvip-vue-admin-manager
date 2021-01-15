<template>
    <mi-register
        :action="api.register"
        :username-verify-action="api.validator.name"
        :email-verify-action="api.validator.email">
    </mi-register>
</template>