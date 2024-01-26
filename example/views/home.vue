<template>
    <mi-theme>
        <mi-layout>
            <template #sider>
                <mi-layout-sider>
                    <template #logo>
                        <mi-layout-sider-logo>
                            <template #notice>
                                <mi-notice :width="360" :tab-active="1">
                                    <mi-notice-tab name="我的消息">
                                        <mi-notice-item title="推荐有奖" summary="邀请好友，享8重好礼！" />
                                        <mi-notice-item title="每日签到" summary="连续签到，奖励丰厚！" />
                                    </mi-notice-tab>
                                    <mi-notice-tab name="系统通知">
                                        <template #icon><AuditOutlined /></template>
                                        <mi-notice-item title="推荐有奖" summary="邀请好友，享8重好礼！" />
                                        <mi-notice-item title="每日签到" summary="连续签到，奖励丰厚！" />
                                        <mi-notice-item title="推荐有奖" summary="邀请好友，享8重好礼！" />
                                    </mi-notice-tab>
                                    <mi-notice-tab name="广播频道">
                                        <template #icon><NotificationOutlined /></template>
                                        <mi-notice-item title="推荐有奖" summary="邀请好友，享8重好礼！" />
                                        <mi-notice-item title="每日签到" summary="连续签到，奖励丰厚！" />
                                        <mi-notice-item title="推荐有奖" summary="邀请好友，享8重好礼！" />
                                        <mi-notice-item title="每日签到" summary="连续签到，奖励丰厚！" />
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
import { NotificationOutlined, AuditOutlined } from '@ant-design/icons-vue'
</script>