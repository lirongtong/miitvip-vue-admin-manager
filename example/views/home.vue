<template>
    <mi-theme>
        <mi-layout>
            <template #sider>
                <mi-layout-sider>
                    <template #logo>
                        <mi-layout-sider-logo>
                            <template #notice>
                                <mi-notice :width="360" :tabs="data.tabs2" v-model:tab-active="noticeActiveTab" @tab-click="handleClick" @tab-change="handleChange">
                                    <mi-notice-tab key="0" name="我的消息">
                                        <mi-notice-item title="推荐有奖" summary="邀请好友，享8重好礼！" />
                                        <mi-notice-item title="每日签到" summary="连续签到，奖励丰厚！" />
                                    </mi-notice-tab>
                                    <mi-notice-tab key="1" name="系统通知">
                                        <template #icon><AuditOutlined /></template>
                                        <mi-notice-item title="推荐有奖" summary="邀请好友，享8重好礼！" />
                                        <mi-notice-item title="每日签到" summary="连续签到，奖励丰厚！" />
                                        <mi-notice-item title="推荐有奖" summary="邀请好友，享8重好礼！" />
                                    </mi-notice-tab>
                                    <mi-notice-tab key="2" name="广播频道">
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
import { createVNode, reactive, ref } from 'vue'
import { NotificationOutlined, AuditOutlined } from '@ant-design/icons-vue'

const data = reactive({
    tabs: ['我的消息', '系统通知', '广播频道'],
    items: [
        [
            {title: '推荐有奖1', summary: '邀请好友，享8重好礼！', date: '2014-01-27'},
            {title: '每日签到1', summary: '连续签到，奖励丰厚！', date: '2014-01-27'}
        ],
        [
            {title: '推荐有奖2', summary: '邀请好友，享8重好礼！', date: '2014-01-27'},
            {title: '每日签到2', summary: '连续签到，奖励丰厚！', date: '2014-01-27'},
            {title: '推荐有奖2', summary: '邀请好友，享8重好礼！', date: '2014-01-27'}
        ],
        [
            {title: '推荐有奖3', summary: '邀请好友，享8重好礼！', date: '2014-01-27'},
            {title: '每日签到3', summary: '连续签到，奖励丰厚！', date: '2014-01-27'},
            {title: '推荐有奖3', summary: '邀请好友，享8重好礼！', date: '2014-01-27'},
            {title: '每日签到3', summary: '连续签到，奖励丰厚！', date: '2014-01-27'}
        ]
    ],
    tabs2: [{
        name: '我的消息',
        items: [
            {title: '推荐有奖', summary: '邀请好友，享8重好礼！', date: '2014-01-27'},
            {title: '每日签到', summary: '连续签到，奖励丰厚！', date: '2014-01-27'}
        ]
    }, {
        name: '系统通知',
        icon: createVNode(AuditOutlined),
        items: [
            {title: '推荐有奖', summary: '邀请好友，享8重好礼！', date: '2014-01-27'},
            {title: '每日签到', summary: '连续签到，奖励丰厚！', date: '2014-01-27'},
            {title: '推荐有奖', summary: '邀请好友，享8重好礼！', date: '2014-01-27'}
        ]
    }, {
        name: '广播频道',
        icon: createVNode(NotificationOutlined),
        items: [
            {title: '推荐有奖', summary: '邀请好友，享8重好礼！', date: '2014-01-27'},
            {title: '每日签到', summary: '连续签到，奖励丰厚！', date: '2014-01-27'},
            {title: '推荐有奖', summary: '邀请好友，享8重好礼！', date: '2014-01-27'},
            {title: '每日签到', summary: '连续签到，奖励丰厚！', date: '2014-01-27'}
        ]
    }]
})

const handleClick = (key: string) => {
    console.log('click', key)
}
const handleChange = (k: string) => {
    console.log('change', k)
}
const noticeActiveTab = ref<string>('0')
</script>