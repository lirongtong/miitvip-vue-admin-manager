<template>
    <mi-login :action="action"></mi-login>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        methods: {
            action(data: any) {
                console.log(data)
            }
        }
    })
</script>