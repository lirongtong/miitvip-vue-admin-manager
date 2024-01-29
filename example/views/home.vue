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
                                        <template #icon><AuditOutlined /></template>
                                        <mi-notice-item v-for="item in items" :title="item?.title" :content="item?.content" />
                                    </mi-notice-tab>
                                    <mi-notice-tab key="1" name="我的消息">
                                        <mi-notice-item title="每日签到" summary="连续签到，享8重好礼！" />
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
import { ref, createVNode, renderSlot } from 'vue'
import { FireFilled, LikeFilled, AuditOutlined } from '@ant-design/icons-vue'

const tabActive = ref('0')
const items = [
    {
        title: '扬鞭东指',
        content: '站在历史的海岸漫溯那一道道历史沟渠：楚大夫沉吟泽畔，九死不悔;魏武帝扬鞭东指，壮心不已;陶渊明悠然南山，饮酒采菊……他们选择了永恒，纵然谄媚诬蔑视听，也不随其流扬其波，这是执着的选择;纵然马革裹尸，魂归狼烟，只是豪壮的选择;纵然一身清苦，终日难饱，也愿怡然自乐，躬耕陇亩，这是高雅的选择。在一番选择中，帝王将相成其盖世伟业，贤士迁客成其千古文章。',
        tag: createVNode(FireFilled, { color: 'red' })
    },
    {
        title: '心的本色',
        content: '心的本色该是如此。成，如朗月照花，深潭微澜，不论顺逆，不论成败的超然，是扬鞭策马，登高临远的驿站;败，仍滴水穿石，汇流入海，有穷且益坚，不坠青云的傲岸，有“将相本无主，男儿当自强”的倔强。荣，江山依旧，风采犹然，恰沧海巫山，熟视岁月如流，浮华万千，不屑过眼烟云;辱，胯下韩信，雪底苍松，宛若羽化之仙，知退一步，海阔天空，不肯因噎废食。'
    },
    {
        title: '物质/欲望',
        content: '快乐=物质/欲望。这是美国经济学家萨缪尔森提出的快乐方程式。从经济学的观点看，物质消费越大，欲望越小，快乐就越大，正应了中国人的一句古话“知足常乐”。反之，如果一个人的物质消费有限，而欲望无穷大，将会怎样呢?路瓦栽夫人有那么多“梦想”，又有那么多“陶醉”，她怎么能不痛苦、伤心呢?',
        tag: createVNode(LikeFilled, { color: 'green' })
    }
]
</script>