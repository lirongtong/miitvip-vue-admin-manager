<template>
    <mi-theme>
        <mi-layout>
            <template #sider>
                <mi-layout-sider>
                    <template #logo>
                        <mi-layout-sider-logo>
                            <template #notice>
                                <mi-notice :width="360">
                                    <mi-notice-tab name="我的消息">
                                        <mi-notice-item title="Item Title 1" summary="Item Summary 1" />
                                        <mi-notice-item title="Item Title 2" summary="Item Summary 2" />
                                        <mi-notice-item title="Item Title 2" summary="Item Summary 2" />
                                        <mi-notice-item title="Item Title 2" summary="Item Summary 2" />
                                    </mi-notice-tab>
                                    <mi-notice-tab name="系统消息">
                                        <template #icon><NotificationOutlined /></template>
                                    </mi-notice-tab>
                                </mi-notice>
                            </template>
                        </mi-layout-sider-logo>
                    </template>
                </mi-layout-sider>
            </template>
        </mi-layout>
    </mi-theme>
</template>

<script lang="ts" setup>
import { NotificationOutlined } from '@ant-design/icons-vue'
</script>