<template>
    <mi-items-detail
        v-model:active="active"
        :data="data"
        :max-width="1120"
        :thumb-setting="{
            width: { mobile: '100%', tablet: 280, laptop: 360 },
            height: { mobile: 'auto', tablet: 180, laptop: 220}
        }"
        @item-click="handleItemClick">
        <template #detail="data">
            <template v-if="active === 0">
                <div style="color: var(--mi-background); padding-left: 1rem; padding-right: 1rem">
                点击返回的参数（当前点击 Item 及数组下标）：<br />
                    <mi-code language="json" :content="`item = ` + JSON.stringify(data?.item).replace(/,/ig, ',\r\n&emsp;').replace(/{/ig, '{\r\n&emsp;').replace(/}/ig, '\r\n}') + `\r\nindex = ` + data?.index" />
                </div>
                <div style="margin: 2rem 0">
                    <mi-items-text
                        :items="poetry.libai"
                        :indent="24"
                        :gap="4"
                        :center="true"
                        :title="{
                            size: 24,
                            bold: true,
                            color: 'var(--mi-background)',
                            margin: { left: 82 }
                        }"
                        :marker="{
                            type: 'circle',
                            color: 'var(--mi-error)',
                            size: 6,
                            center: true,
                            margin: { right: 8 }
                        }"
                        color="var(--mi-background)"
                        :size="18" />
                </div>
            </template>

            <template v-if="active === 1">
                <div style="color: var(--mi-background); padding-left: 1rem; padding-right: 1rem">
                点击返回的参数（当前点击 Item 及数组下标）：<br />
                    <mi-code language="json" :content="`item = ` + JSON.stringify(data?.item).replace(/,/ig, ',\r\n&emsp;').replace(/{/ig, '{\r\n&emsp;').replace(/}/ig, '\r\n}') + `\r\nindex = ` + data?.index" />
                </div>
                <div style="margin: 2rem 0">
                    <mi-items-text
                        :items="poetry.dufu"
                        :indent="24"
                        :gap="4"
                        :center="true"
                        :title="{
                            size: 24,
                            bold: true,
                            color: 'var(--mi-background)',
                            margin: { left: 90 }
                        }"
                        :marker="{
                            type: 'circle',
                            color: 'var(--mi-error)',
                            size: 6,
                            center: true,
                            margin: { right: 8 }
                        }"
                        color="var(--mi-background)"
                        :size="18" />
                </div>
            </template>

            <template v-if="active === 2">
                <div style="color: var(--mi-background); padding-left: 1rem; padding-right: 1rem">
                点击返回的参数（当前点击 Item 及数组下标）：<br />
                    <mi-code language="json" :content="`item = ` + JSON.stringify(data?.item).replace(/,/ig, ',\r\n&emsp;').replace(/{/ig, '{\r\n&emsp;').replace(/}/ig, '\r\n}') + `\r\nindex = ` + data?.index" />
                </div>
                <div style="margin: 2rem 0">
                    <mi-items-text
                        :items="poetry.baijuyi"
                        :center="true"
                        :title="{
                            size: 24,
                            bold: true,
                            color: 'var(--mi-background)',
                            margin: { left: 80 }
                        }"
                        :marker="{
                            type: 'circle',
                            color: 'var(--mi-error)',
                            size: 6,
                            center: true,
                            margin: { right: 8 }
                        }"
                        color="var(--mi-background)"
                        :size="18" />
                </div>
            </template>

            <template v-if="active === 3">
                <div style="color: var(--mi-background); padding-left: 1rem; padding-right: 1rem">
                点击返回的参数（当前点击 Item 及数组下标）：<br />
                    <mi-code language="json" :content="`item = ` + JSON.stringify(data?.item).replace(/,/ig, ',\r\n&emsp;').replace(/{/ig, '{\r\n&emsp;').replace(/}/ig, '\r\n}') + `\r\nindex = ` + data?.index" />
                </div>
                <div style="margin: 2rem 0">
                    <mi-items-text
                        :items="poetry.lishangyin"
                        :center="true"
                        :title="{
                            size: 24,
                            bold: true,
                            color: 'var(--mi-background)',
                            margin: { left: 92 }
                        }"
                        :marker="{
                            type: 'circle',
                            color: 'var(--mi-error)',
                            size: 6,
                            center: true,
                            margin: { right: 8 }
                        }"
                        color="var(--mi-background)"
                        :size="18" />
                </div>
            </template>
        </template>
    </mi-items-detail>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'prismjs/components/prism-json'
// @ts-ignore
import libai from '@/assets/images/poet/libai.jpg'
// @ts-ignore
import dufu from '@/assets/images/poet/dufu.jpg'
// @ts-ignore
import baijuyi from '@/assets/images/poet/baijuyi.jpg'
// @ts-ignore
import lishangyin from '@/assets/images/poet/lishangyin.jpeg'

const active = ref(0)
const data = [
    {
        title: '《唐诗三百首》',
        subtitle: '唐·李白',
        thumb: libai
    },
    {
        title: '《唐诗三百首》',
        subtitle: '唐·杜甫',
        thumb: dufu
    },
    {
        title: '《唐诗三百首》',
        subtitle: '唐·白居易',
        thumb: baijuyi
    },
    {
        title: '《唐诗三百首》',
        subtitle: '唐·李商隐',
        thumb: lishangyin
    }
]
const poetry = {
    libai: [
        {
            title: '《静夜思》',
            items: [
                '床前明月光，疑是地上霜。',
                '举头望明月，低头思故乡。'
            ]
        }
    ],
    dufu: [
        {
            title: '《望岳》',
            items: [
                '岱宗夫如何，齐鲁青未了。',
                '造化钟神秀，阴阳割昏晓。',
                '荡胸生层云，决眦入归鸟。',
                '会当凌绝顶，一览众山小。'
            ]
        }
    ],
    baijuyi: [
        {
            gap: 4,
            title: '《大林寺桃花》',
            items: [
                '人间四月芳菲尽，山寺桃花始盛开。',
                '长恨春归无觅处，不知转入此中来。'
            ]
        }
    ],
    lishangyin: [
        {
            gap: 4,
            title: '《蝉》',
            items: [
                '本以高难饱，徒劳恨费声。',
                '五更疏欲断，一树碧无情。',
                '薄宦梗犹泛，故园芜已平。',
                '烦君最相警，我亦举家清。'
            ]
        }
    ]
}

const handleItemClick = (item: any, index: number) => {
    // TODO: do something
    if (active.value !== -1) {
        console.log('item click event: ', item, index)
    }
}
</script>