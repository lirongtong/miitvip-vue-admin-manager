<template>
    <mi-quote>
        <p>
            「
            <span class="important">Makeit Admin Pro</span>
            」致力于提供给程序员愉悦的开发体验。
        </p>
        <ul>
            <li>
                <div>
                    在开始之前，推荐先学习「
                    <span class="important inline-block">
                        <mi-link path="https://vuejs.org" target="_blank">Vue</mi-link>
                    </span>
                    」和「
                    <span class="important inline-block">
                        <mi-link path="https://babeljs.io/docs/learn" target="_blank">
                            ES2015
                        </mi-link>
                    </span>
                    」，并正确安装和配置了「
                    <span class="important inline-block">
                        <mi-link path="https://nodejs.org" target="_blank">NodeJS</mi-link>
                    </span>
                    」v18.18.2 或以上版本。
                </div>
            </li>
            <li>
                <div>
                    官方指南假设你已了解关于「
                    <span class="important">HTML / CSS / Javascript</span>
                    」的中级知识，并且已经完全掌握了「
                    <span class="important">Vue</span>
                    」的正确开发方式。
                </div>
            </li>
            <li>
                <div>
                    如果你刚开始学习前端或者「
                    <span class="important">Vue</span>
                    」，将
                    <span class="important">UI 框架</span> 作为你的第一步可能不是最好的主意。
                </div>
            </li>
        </ul>
    </mi-quote>

    <mi-theme-provider :tokens="{ quote: { text: '#f00' } }">
        <mi-quote>局部主题配置生效</mi-quote>
    </mi-theme-provider>
</template>