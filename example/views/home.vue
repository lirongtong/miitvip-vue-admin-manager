<template>
    <mi-theme>
        <mi-layout>
            <template #sider>
                <mi-layout-sider>
                    <template #logo>
                        <mi-layout-sider-logo>
                            <template #notice>
                                <mi-notice :width="360">
                                    <mi-notice-tab key="1" name="系统消息">
                                        <mi-notice-item title="Item Title 1" summary="Item Summary 1" />
                                        <mi-notice-item title="Item Title 2" summary="Item Summary 2" />
                                        <mi-notice-item title="Item Title 2" summary="Item Summary 2" />
                                        <mi-notice-item title="Item Title 2" summary="Item Summary 2" />
                                    </mi-notice-tab>
                                    <mi-notice-tab key="2" name="Tab Title 2"></mi-notice-tab>
                                    <mi-notice-tab key="3" name="Tab Title 3"></mi-notice-tab>
                                    <mi-notice-tab key="4" name="Tab Title 4"></mi-notice-tab>
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
import { MessageOutlined } from '@ant-design/icons-vue'
</script>