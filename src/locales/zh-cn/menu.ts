export default {
    add: `新增菜单`,
    update: `更新菜单`,
    name: `名称`,
    title: `标题`,
    type: `类型`,
    icon: `图标`,
    page: `前端组件`,
    path: `访问路径`,
    weight: `排序值`,
    top: `一级菜单`,
    sub: {
        name: `子菜单`,
        add: `添加子菜单`
    },
    up: `上级菜单`,
    detail: `详情`,
    subtitle: `子标题`,
    unknown: `未知类型`,
    auth: `授权标识`,
    policy: `授权策略`,
    btn: {
        name: `按钮名称`,
        permission: `按钮/权限`
    },
    lang: `多语言关键词`,
    open: `打开方式`,
    router: { hide: `隐藏菜单` },
    redirect: `默认跳转地址`,
    login: `是否需要登录`,
    policies: {
        invisible: '不可见',
        visible: '仅可见',
        accessible: '可见/可访问'
    },
    icons: {
        wireframe: `线框风格`,
        solid: `实底风格`,
        directional: '方向类图标',
        tips: '提示类图标',
        edit: '编辑类图标',
        data: '数据类图标',
        brands: '品牌类图标',
        generic: '通用类图标'
    },
    badge: {
        label: `徽章设置`,
        content: `文案内容`,
        color: `字体颜色`,
        bg: `背景颜色`,
        radius: `圆角弧度`,
        setting: `点击配置`,
        preview: `效果预览`,
        none: `暂无效果`,
        size: `字体大小`
    },
    tips: {
        title: `非必填，首选多语言配置标题，次选手动配置标题，默认都为空则与 '名称' 属性内容一致`,
        weight: `值越大，越靠前`,
        badge: `首选文案，次选图标`
    },
    placeholder: {
        name: '请输入唯一的菜单名称，如：mi-dashboard',
        title: '请输入菜单标题，如：控制台',
        subtitle: '请输入菜单子标题，如：Dashboard',
        path: '请输入菜单访问路径，如：/dashboard',
        page: '请输入菜单对应的前端组件页面，如：views/dashboard',
        redirect: '请输入默认跳转地址',
        lang: '请输入显示标题的多语言 Key 值',
        search: '请输入待搜索的菜单名称',
        btn: '请输入按钮/权限名称，如：新增',
        icon: '请选择图标',
        up: '请选择上级菜单',
        auth: '请输入唯一的授权标识, 如: personal:data',
        content: `请输入文案内容`,
        color: `点击选择颜色`
    }
}
