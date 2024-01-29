<template>
    <mi-theme>
        <mi-layout>
            <template #sider>
                <mi-layout-sider>
                    <template #logo>
                        <mi-layout-sider-logo>
                            <template #notice>
                                <mi-notice :width="360" v-model:tab-active="tabActive">
                                    <mi-notice-tab key="0" name="系统消息">
                                        <mi-notice-item title="扬鞭东指" content="站在历史的海岸漫溯那一道道历史沟渠：楚大夫沉吟泽畔，九死不悔;魏武帝扬鞭东指，壮心不已;陶渊明悠然南山，饮酒采菊……他们选择了永恒，纵然谄媚诬蔑视听，也不随其流扬其波，这是执着的选择;纵然马革裹尸，魂归狼烟，只是豪壮的选择;纵然一身清苦，终日难饱，也愿怡然自乐，躬耕陇亩，这是高雅的选择。在一番选择中，帝王将相成其盖世伟业，贤士迁客成其千古文章。">
                                            <template #tag>
                                                <FireFilled :style="{ color: 'red' }" />
                                            </template>
                                        </mi-notice-item>
                                    </mi-notice-tab>
                                    <mi-notice-tab key="1" name="我的消息">
                                        <mi-notice-item title="每日签到1" content="连续签到，享8重好礼！" />
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
import { FireFilled } from '@ant-design/icons-vue'

const tabActive = ref('0')
</script>