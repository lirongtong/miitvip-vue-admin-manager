# 弹窗提示

> 「 弹窗 」 组件的作用在于当前处理中的事务中包含与整体事务流程不相关，但又与某个事务节点存在关系的事务，当前情况下肯定不希望跳转页面来处理单个节点的事务而导致整个事务流程中断，此时「 `Modal` 」组件可以在当前页面打开一个浮层来处理事务节点，不影响整个事务的流程。

## 使用示例

### 默认

```html
<template>
    <a-button>点击打开弹窗</a-button>
    <mi-modal v-model:open="open" @click="handleModal" title="自定义弹窗标题（Title）">
        自定义弹窗内容（Content）
    </mi-modal>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    const open = ref<boolean>(false)

    const handleModal = () => {
        open.value = !open.value
        // do something
        console.log('click event')
    }
</script>
```

### 动效

```html
<template>
    <!-- 动画请查看 `./component/_utils/props - animations` -->
    <div class="btn">Scale（放大显现 - 默认）</div>
    <mi-modal v-model:open="params.open" :animation="params.animation" @click="handleAnimModal('scale')" :key="params.animation" title="自定义弹窗标题（Title）">
        自定义弹窗内容（Content）
    </mi-modal>
</template>

<script setup lang="ts">
    import { reactive } from 'vue'

    const params = reactive({
        open: false,
        animation: 'scale'
    })

    const handleAnimModal = (name: string) => {
        params.animation = name
        params.open = !params.open
    }
</script>
```

### 快捷

```html
<template>
    <div class="btn" @click="handleQuickModal('success')">Success</div>
</template>

<script setup lang="ts">
    import { getCurrentInstance, type ComponentInternalInstance } from 'vue'

    const { appContext: { config: { globalProperties: _this } } } = getCurrentInstance() as ComponentInternalInstance

    const handleQuickModal = (type: string) => {
        switch(type) {
            case 'success':
                _this.$modal.success({content: '操作成功（Successed）'})
                break;
            case 'error':
                _this.$modal.error({content: '操作失败（Failed）'})
                break;
            case 'warning':
                _this.$modal.warning({content: '请先引入「 Pinia 」组件'})
                break;
            case 'confirm':
                _this.$modal.confirm({content: '确定删除当前所选的项目吗？'})
                break;
            default:
                _this.$modal.success({content: '操作成功（Successed）'})
                break;
        }
    }
</script> 
```

## 主题配置

### 配置示例

> 请查看 「 [`主题配置`](../theme/README.md) 」组件

### Tokens

#### Modal Tokens

| Token | 默认值
| :---- | :----
| `--mi-modal-btn-text-default` | `--mi-on-surface-variant`
| `--mi-modal-btn-text-active` | `--mi-surface`
| `--mi-modal-btn-active-start` | `--mi-primary`
| `--mi-modal-btn-active-hint` | `--mi-secondary`
| `--mi-modal-btn-active-stop` | `--mi-tertiary`
| `--mi-modal-btn-border` | `rgba(--mi-rgb-on-surface-variant, .5)`
| `--mi-modal-quick-background-start` | `--mi-surface`
| `--mi-modal-quick-background-stop` | `--mi-surface-variant`
| `--mi-modal-quick-border` | `rgba(--mi-rgb-primary, .1)`

#### Modal Popup Tokens

| Token | 默认值
| :---- | :----
| `--mi-modal-popup-border` | `--mi-primary`
| `--mi-modal-popup-background-start` | `--mi-surface`
| `--mi-modal-popup-background-stop` | `--mi-surface-variant`
| `--mi-modal-popup-header-border` | `rgba(--mi-rgb-primary, .1)`
| `--mi-modal-popup-mask-background` | `rgba(--mi-rgb-shadow, .5)`

## API

### MiModal `<mi-modal>`

#### `MiModal` 属性 ( `Properties` )

| 参数 | 类型 | 默认值 | 说明
| :---- | :---- | :---- | :----
| `title` | `vSlot` | `''` | 标题
| `content` | `vSlot` | `''` | 内容
| `cancelText` | `vSlot` | `''` | 取消按钮文案
| `okText` | `vSlot` | `''` | 确定按钮文案
| `open ( v-model )` | `boolean` | `false` | 弹窗开启状态
| `ok` | `function` | `''` | 确定回调
| `cancel` | `function` | `''` | 取消回调
| `mask` | `boolean` | `true` | 是否显示遮罩
| `maskStyle` | `CSSProperties` | `{}` | 遮罩样式
| `maskClosable` | `boolean` | `true` | 遮罩是否可以点击关闭弹窗
| `width` | `string \| number \|` [`DeviceSize`](../../utils/README.md) | `520` | 弹窗宽度
| `height` | `string \| number \|` [`DeviceSize`](../../utils/README.md) | `''` | 弹窗高度
| `zIndex` | `number` | `Date.now()` | 弹窗显示层级
| `closable` | `boolean` | `true` | 是否可以关闭弹窗
| `container` | `string \| Function \| boolean \| HTMLElement` | `true` | 渲染容器
| `forceRender` | `boolean` | `''` | 强制渲染
| `destroyOnClose` | `boolean` | `false` | 关闭 `Modal` 时, 销毁弹窗内的子元素
| `wrapClass` | `string \| string[]` | `''` | `Modal` 容器的自定义样式名
| `footer` | `vSlot` | `''` | 页脚的自定义配置
| `footerBtnPosition` | `string` | `right` | 页脚按钮位置「 `left`, `center`, `right` 」
| `closeIcon` | `vSlot` | `<CloseOutlined />` | 关闭按钮图标
| `animation` | `string` | `scale` | 动画效果「 查看 `./components/_utils/props - animations` 」
| `placement` | `string` | `scale` | 弹窗弹出位置「 查看 `./components/_utils/props - placement` 」
| `afterClose` | `function` | `''` | 弹窗关闭后的事件回调

#### `MiModal` 事件 ( `Events` )

| 方法 | 返回值 | 说明
| :---- | :---- | :----
| `ok` | *None* | 确定回调事件
| `cancel` | *None* | 取消回调事件
| `afterClose` | *None* | 关闭回调事件
