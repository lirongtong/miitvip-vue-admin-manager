<template>
    <mi-items-image
        :data="data"
        :hover="{ open: true, scale: true }"
        line-color="red"
        :width="320"
        :center="true"
        :number="{ mobile: 1, tablet: 2, laptop: 3 }"
        :title-setting="{ bold: true, align: 'center', size: 22 }"
        :subtitle-setting="{ text: `唐·李白`, align: 'center', size: 18 }"
        :intro-setting="{ align: `center`, size: 16 }" />
</template>

<script setup lang="ts">
// @ts-ignore
import thumb from '@/assets/images/background.jpg'

const data = [
    {
        title: '《早发白帝城》',
        thumb: thumb,
        intro: `朝辞白帝彩云间，千里江陵一日还。<br />两岸猿声啼不住，轻舟已过万重山。`,
        link: `https://admin.makeit.vip/start`,
        target: `_blank`
    },
    {
        title: '《客中行》',
        thumb: thumb,
        intro: `兰陵美酒郁金香，玉碗盛来琥珀光。<br />但使主人能醉客，不知何处是他乡。`
    },
    {
        title: '《望庐山瀑布》',
        thumb: thumb,
        intro: `日照香炉生紫烟，遥看瀑布挂前川。<br />飞流直下三千尺，疑是银河落九天。`
    },
    {
        title: '《送孟浩然之广陵》',
        thumb: thumb,
        intro: `故人西辞黄鹤楼，烟花三月下扬州。<br />孤帆远影碧空尽，唯见长江天际流。`
    },
    {
        title: '《山中与幽人对酌》',
        thumb: thumb,
        intro: `两人对酌山花开，一杯一杯复一杯。<br />我醉欲眠君且去，明朝有意抱琴来。`
    },
    {
        title: '《越中览古》',
        thumb: thumb,
        intro: `越王勾践破吴归，义士还家尽锦衣。<br />宫女如花满春殿，只今惟有鹧鸪飞。`
    }
]
</script>