<template>
    <div style="margin-top: 24px">
        <mi-apps-language
            :get-category-action="api.languages.category.normal"
            :create-category-action="api.languages.category.normal"
            :update-category-action="api.languages.category.normal"
            :delete-category-action="api.languages.category.normal"
            :set-default-category-action="api.languages.category.default"
            :check-category-exist-action="api.languages.category.check"
            :get-content-action="api.languages.normal"
            :create-content-action="api.languages.normal"
            :update-content-status-action="api.languages.status"
            :batch-create-content-action="api.languages.batch"
            :update-content-action="api.languages.normal"
            :delete-content-action="api.languages.normal"
            :check-content-exist-action="api.languages.check"
            :get-module-action="api.languages.module.normal"
            :check-module-exist-action="api.languages.module.check"
            :create-module-action="api.languages.module.normal"
            :delete-module-action="api.languages.module.normal"
            :update-module-action="api.languages.module.normal" />
    </div>
</template>

<script setup lang="ts">
import { useApi } from '../../../src/index'

const api = useApi()
</script>