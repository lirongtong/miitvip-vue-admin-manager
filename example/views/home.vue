<template>
    <mi-theme>
        <mi-layout>
            <template #sider>
                <mi-layout-sider>
                    <template #logo>
                        <mi-layout-sider-logo>
                            <template #notice>
                                <mi-notice :width="360" v-model:tab-active="noticeActiveTab">
                                    <mi-notice-tab key="1" name="我的消息">
                                        <mi-notice-item title="推荐有奖" summary="邀请好友，享8重好礼！" />
                                        <mi-notice-item title="每日签到" summary="连续签到，奖励丰厚！" />
                                    </mi-notice-tab>
                                    <mi-notice-tab key="2" name="系统通知">
                                        <template #icon><AuditOutlined /></template>
                                        <mi-notice-item title="推荐有奖" summary="邀请好友，享8重好礼！" />
                                        <mi-notice-item title="每日签到" summary="连续签到，奖励丰厚！" />
                                        <mi-notice-item title="推荐有奖" summary="邀请好友，享8重好礼！" />
                                    </mi-notice-tab>
                                    <mi-notice-tab key="3" name="广播频道">
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
import { ref } from 'vue'

const noticeActiveTab = ref<string>('1')
import { NotificationOutlined, AuditOutlined } from '@ant-design/icons-vue'
</script>