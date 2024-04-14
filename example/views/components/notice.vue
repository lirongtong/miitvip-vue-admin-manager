<template>
    <div style="padding: 2rem">
        <mi-notice :width="320" :tabs="tabs" />
        <mi-notice :width="320" :tabs="tabs" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref('0')
const tabs = [
    {
        tab: '全部',
        name: 'all',
        items: [
            {
                title: '深入浅出 React 状态管理库',
                content: `学习状态管理库对于处理大型和复杂的前端应用至关重要，因为它们帮助集中管理应用状态，确保数据的一致性和组件间的有效通信。通过状态管理，开发者可以更容易地追踪和调试应用状态，提高开发和维护的效率。此外，良好的状态管理还能提升应用的性能，减少不必要的重新渲染（re-render）。`,
                tag: '新品',
                tagColor: '#32a852'
            },
            {
                title: 'Java 并发：JUC 入门与进阶',
                summary: `Java 技术的迅猛发展使得各个领域的成熟度都非常高.`,
                content: `Java 技术的迅猛发展使得各个领域的成熟度都非常高，许多 Java 开发者习惯于依赖各种成熟的框架，从而实现“开箱即用”。然而，有时候他们可能会忽略对自身 Java 基础功底的深入修炼。熟练掌握 Java 基础，并深入理解其原理，对于开发者更好地使用和理解开发框架大有裨益。`
            }
        ]
    },
    {
        tab: '前端',
        name: 'frontend'
    }
]
</script>