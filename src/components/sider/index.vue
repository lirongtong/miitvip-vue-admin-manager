<template>
    <a-layout-sider
        class="mi-layout-sider"
        :clooapsible="true"
        theme="light"
        width="256"
        breakpoint="lg"
        :trigger="null">
        <slot name="sider">
            <mi-layout-sider-logo></mi-layout-sider-logo>
            <mi-layout-sider-menu></mi-layout-sider-menu>
        </slot>
    </a-layout-sider>
</template>