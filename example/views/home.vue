<template>
    <mi-theme>
        <mi-layout>
            <template #sider>
                <mi-layout-sider>
                    <template #logo>
                        <mi-layout-sider-logo>
                            <template #notice>
                                <mi-notice :width="360">
                                    <mi-notice-tab name="系统消息">
                                        <mi-notice-item title="每日签到" summary="连续签到，享8重好礼！"></mi-notice-item>
                                    </mi-notice-tab>
                                    <mi-notice-tab name="我的消息"></mi-notice-tab>
                                </mi-notice>
                            </template>
                        </mi-layout-sider-logo>
                    </template>
                </mi-layout-sider>
            </template>
        </mi-layout>
    </mi-theme>
</template>