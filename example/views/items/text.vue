<template>
    <mi-items-text
        :center="true"
        :padding="16"
        :items="[
            {
                gap: 8,
                title: 'Text Item Title',
                items: [
                    'Text Item 1',
                    'Text Item 2',
                    'Text Item 3'
                ]
            },
            {
                gap: 8,
                title: 'Text Item Title 2',
                items: [
                    'Text Item 21',
                    'Text Item 22',
                    'Text Item 23'
                ]
            }
        ]"
        :gap="24"
        :indent="32"
        :marker="{ type: 'roman-number', gap: 8, suffix: '.' }"
        :title="{
            size: 24,
            bold: true,
            marker: {
                type: 'circle',
                color: 'red',
                size: 8,
                margin: { top: 20 }
            }
        }">
        <template #item>
            <mi-items-text
                :items="['text1', 'text2']"
                :indent="24"
                :gap="4"
                :marker="{
                    type: 'square',
                    color: 'yellow',
                    center: true,
                    size: 6
                }">
                <template #item>
                    <mi-items-text
                        :items="['text3', 'text4']"
                        :indent="24"
                        :gap="4"
                        :marker="{
                            type: 'number',
                            center: true,
                            prefix: '(',
                            suffix: ') -'
                        }" />
                </template>
            </mi-items-text>
        </template>
    </mi-items-text>
</template>