<template>
    <mi-items-list background="#fff" :radius="8" :data="data" />
</template>

<script setup lang="ts">
// @ts-ignore
import thumb from '@/assets/images/background.jpg'

const data = [
    {
        thumb: { src: thumb, width: 320, radius: 8 },
        title: '澳门六大博彩巨头转型，千亿巨款投入多元产业，何猷君崭露头角',
        intro: '“赌王”何鸿燊一生共生育了6名儿子，11名女儿，1995年出生的何猷君是最小的儿子。与哥哥姐姐们相比，何猷君不是最成功的那个，四姐何超琼有着澳门“赌后”之称，是美高梅中国的董事局主席，二哥何猷龙则执掌着新濠国际。',
        date: '2024-12-24 10:32',
        link: 'https://news.qq.com/rain/a/20241224A02L1900',
        target: '_blank'
    }
]
</script>