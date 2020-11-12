<template>
    <mi-layout>
        <template v-slot:header>
            <mi-layout-header>
                <template v-slot:notice>
                    <mi-notice :count="100" placement="bottom" :tabs="[{
                        id: 'notice',
                        name: '消息'
                    }, {
                        id: 'coming',
                        name: '待办'
                    }]" :data="{
                        notice: [{
                            title: 'Good Job',
                            icon: 'ExpandOutlined'
                        }],
                        coming: [{
                            title: 'Nice Job',
                            icon: 'ExpandOutlined'
                        }]
                    }"></mi-notice>
                </template>
            </mi-layout-header>
        </template>
    </mi-layout>
</template>