<template>
    <div style="margin-top: 24px">
        <mi-apps-menu
            :get-menus-action="api.menus"
            :create-menus-action="api.menus"
            :update-menus-action="api.menus"
            :delete-menus-action="api.menus" />
    </div>
</template>

<script setup lang="ts">
import { useApi } from '../../../src/index'

const api = useApi()
</script>