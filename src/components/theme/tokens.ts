import { ThemeConfig } from '../../utils/types'
/**
 * +====================+
 * |        背景        |
 * +====================+
 * @param color 颜色值
 * @param gradient 渐变色
 *
 * @see GradientTokens
 */
export interface BackgroundTokens {
    color: string
    gradient: Partial<GradientTokens>
}

/**
 * +=======================+
 * |        颜色状态        |
 * +=======================+
 * @param default 默认
 * @param active 选中
 * @param hover 悬停
 */
export interface ColorStateTokens {
    default: string
    active: string
    hover: string
}

/**
 * +=======================+
 * |         渐变色        |
 * +=======================+
 * @param start 渐变线的起始点颜色值
 * @param hint 相邻色标之间的渐变过程颜色值
 * @param stop 色标位置的颜色值
 */
export interface GradientTokens {
    start: string
    hint: string
    stop: string
}

/**
 * +====================+
 * |        主题        |
 * +====================+
 * @param theme 主题 ( 深色 / 浅色 )
 * @param primary 主题色
 * @param radius 圆角
 * @param components 组件
 *
 * @see Theme
 * @see ComponentTokens
 */
export interface ThemeTokens extends ThemeConfig {
    [key: string]: any
    components: Partial<ComponentTokens>
}

/**
 * +====================+
 * |        组件        |
 * +====================+
 * @param layout 布局
 * @param notice 消息中心
 * @param clock 时钟
 * @param captcha 滑块验证码
 * @param breadcrumb 面包屑
 * @param code 代码高亮
 * @param dropdown 下拉菜单
 * @param menu 菜单
 * @param modal 弹窗
 * @param palette 调色板
 * @param quote 引用说明
 * @param search 联想搜索
 * @param title 标题设置
 * @param password 密码设置
 * @param anchor 锚点连接
 * @param backtop 回到顶部
 * @param forget 忘记密码
 * @param login 登录页面
 * @param register 注册页面
 * @param socialite 社会化登录
 *
 * @see LayoutTokens
 * @see NoticeTokens
 * @see ClockTokens
 * @see CaptchaTokens
 * @see BreadcrumbTokens
 * @see CodeTokens
 * @see DropdownTokens
 * @see MenuTokens
 * @see ModalTokens
 * @see PaletteTokens
 * @see QuoteTokens
 * @see SearchTokens
 * @see TitleTokens
 * @see PasswordTokens
 * @see AnchorTokens
 * @see BacktopTokens
 * @see PassportTokens
 * @see SocialiteTokens
 */
export interface ComponentTokens {
    [key: string]: any
    layout: Partial<LayoutTokens>
    notice: Partial<NoticeTokens>
    clock: Partial<ClockTokens>
    captcha: Partial<CaptchaTokens>
    breadcrumb: Partial<BreadcrumbTokens>
    code: Partial<CodeTokens>
    dropdown: Partial<DropdownTokens>
    menu: Partial<MenuTokens>
    modal: Partial<ModalTokens>
    palette: Partial<PaletteTokens>
    quote: Partial<QuoteTokens>
    search: Partial<SearchTokens>
    title: Partial<TitleTokens>
    password: Partial<PasswordTokens>
    anchor: Partial<AnchorTokens>
    backtop: Partial<BacktopTokens>
    forget: Partial<PassportTokens>
    login: Partial<PassportTokens>
    register: Partial<PassportTokens>
    socialite: Partial<SocialiteTokens>
}

/**
 * +====================+
 * |        布局        |
 * +====================+
 * @param background Layout.Main
 * @param header Layout.Header
 * @param sider Layout.Sider
 * @param content Layout.Content
 *
 * @see LayoutHeaderTokens
 * @see LayoutSiderTokens
 * @see LayoutContentTokens
 */
export interface LayoutTokens {
    [key: string]: any
    background: string
    header: Partial<LayoutHeaderTokens>
    sider: Partial<LayoutSiderTokens>
    content: Partial<LayoutContentTokens>
}

/**
 * +=============================+
 * |        布局 - Header        |
 * +=============================+
 */
export interface LayoutHeaderTokens {
    [key: string]: any
    text: string
    background: string
}

/**
 * +============================+
 * |        布局 - Sider        |
 * +============================+
 * @param logo 图标
 *
 * @see LayoutSiderLogoTokens
 */
export interface LayoutSiderTokens {
    [key: string]: any
    logo: Partial<LayoutSiderLogoTokens>
}

/**
 * +=================================+
 * |        布局 - Sider Logo        |
 * +=================================+
 * @param text 文案
 * @param border 边框
 * @param collapsed 菜单ICON
 * @param notice 消息ICON
 * @param trigger 触发器背景
 */
export interface LayoutSiderLogoTokens {
    [key: string]: any
    text: string
    border: string
    collapsed: string
    notice: string
    trigger: string
}

/**
 * +==============================+
 * |        布局 - Content        |
 * +==============================+
 * @param text 文案
 * @param mask 遮罩
 * @param shadow 阴影
 * @param background 背景
 */
export interface LayoutContentTokens {
    [key: string]: any
    text: string
    mask: string
    shadow: string
    background: string
}

/**
 * +====================+
 * |      消息中心      |
 * +====================+
 * @param background 弹窗背景色
 * @param icon 图标颜色
 * @param border 边框颜色
 * @param text 文案颜色 ( 默认空状态时 )
 * @param tab 选项卡文案颜色
 * @param item 选项配置
 *
 * @see NoticeTabTokens
 * @see NoticeItemTokens
 */
export interface NoticeTokens {
    [key: string]: any
    text: string
    border: string
    background: string
    tab: Partial<NoticeTabTokens>
    item: Partial<NoticeItemTokens>
}

/**
 * +==========================+
 * |      消息中心 - Tab      |
 * +==========================+
 * @param text 文案
 * @param icon 图标颜色
 * @param background 背景色
 *
 * @see ColorStateTokens
 * @see GradientTokens
 */
export interface NoticeTabTokens {
    [key: string]: any
    text: Partial<ColorStateTokens>
    icon: Partial<ColorStateTokens>
    background: Partial<GradientTokens> & { default?: string }
}

/**
 * +==========================+
 * |      消息中心 - Item      |
 * +==========================+
 * @param background 背景色
 * @param border 边框色
 * @param text 文案色
 * @param avatar 头像边框颜色
 * @param summary 摘要文案颜色
 * @param date 摘要文案颜色
 * @param tag 标签配置
 * @param content 消息详情配置
 *
 * @see NoticeItemTagTokens
 * @see NoticeItemContentTokens
 */
export interface NoticeItemTokens {
    [key: string]: any
    background: string
    border: string
    text: string
    avatar: string
    summary: string
    date: string
    tag: Partial<NoticeItemTagTokens>
    content: Partial<NoticeItemContentTokens>
}
export interface NoticeItemTagTokens {
    [key: string]: any
    border: string
    background: string
    text: string
}
export interface NoticeItemContentTokens {
    [key: string]: any
    border: string
    background: string
    text: string
}

/**
 * +==========================+
 * |      导航菜单 - Menu      |
 * +==========================+
 * @param background 背景色
 * @param text 文案色
 * @param collapsed 收缩菜单后的配置
 * @param submenu 子菜单配置
 *
 * @see MenuSubmenuToken
 */
export interface MenuTokens {
    text: string
    background: string
    collapsed: Partial<{
        [key: string]: any
        tooltip: Partial<{ [key: string]: any; text: string; background: string }>
    }>
    submenu: Partial<MenuSubmenuToken>
}
/**
 * @param item 子选项的 arrow 配置
 * @param popup 收缩状态下的子菜单弹窗配置
 */
export interface MenuSubmenuToken {
    item: Partial<{
        [key: string]: any
        title: Partial<{ [key: string]: any; arrow: Partial<{ default: string; active: string }> }>
    }>
    popup: Partial<{ [key: string]: any; text: string; border: string; background: string }>
}
/**
 * @param text 菜单选项的默认文案颜色
 * @param title 菜单选项的 Title 配置
 * @param background 菜单选项背景设置
 *
 * @see MenuItemTitleTokens
 * @see GradientTokens
 */
export interface MenuItemTokens {
    text: string
    title: Partial<MenuItemTitleTokens>
    background: Partial<{ [key: string]: any; default: string; active: Partial<GradientTokens> }>
}
/**
 * @param text 标题颜色
 * @param sub 子标题颜色
 * @param active 选中状态的标题及子标题颜色配置
 */
export interface MenuItemTitleTokens {
    text: string
    sub: string
    active: Partial<{ [key: string]: any; text: string; sub: string; icon: string }>
}

/**
 * +====================+
 * |        时钟        |
 * +====================+
 * @param shadow 阴影颜色
 * @param background 背景色
 * @param hour.text 小时刻度文案颜色
 * @param minute.text 分钟刻度文案颜色
 * @param minute.line 分针刻度线颜色
 * @param point.background 指针默认背景色
 * @param point.second 秒针背景色 ( 单独设定 )
 * @param pointer.background 时分秒针汇聚的中间点颜色
 * @param pointer.mid 中间点中间层颜色 ( 大小不一, 层叠 )
 * @param pointer.top 中间点最上层颜色 ( 大小不一, 层叠 )
 *
 * @see BackgroundTokens
 */
export interface ClockTokens {
    shadow: string
    background: Partial<BackgroundTokens>
    hour: Partial<{ text: string }>
    minute: Partial<{ [key: string]: any; text: string; line: string }>
    point: Partial<{
        [key: string]: any
        background: string
        hour: string
        minute: string
        second: string
    }>
    pointer: Partial<{ [key: string]: any; background: string; mid: string; top: string }>
}

/**
 * +=========================+
 * |        滑块验证码        |
 * +=========================+
 * @param radar 雷达配置
 * @param modal 弹窗配置
 *
 * @see CaptchaRadarTokens
 * @see CaptchaModalTokens
 */
export interface CaptchaTokens {
    [key: string]: any
    radar: Partial<CaptchaRadarTokens>
    modal: Partial<CaptchaModalTokens>
}
/**
 * @param border 边框
 * @param text 文本
 * @param ready 准备状态的背景色
 * @param ring 大圆圈
 * @param dot 小圆点
 * @param scan 扫描状态的边框
 * @param success 成功图标及背景色
 */
export interface CaptchaRadarTokens {
    [key: string]: any
    border: string
    text: string
    ready: { background: Partial<GradientTokens> }
    ring: string
    dot: string
    scan: Partial<{ [key: string]: any; border: string }>
    success: Partial<{ [key: string]: any; icon: string; background: string }>
}
/**
 * @param arrow 箭头
 * @param content 内容
 *
 * @see CaptchaModalContentTokens
 */
export interface CaptchaModalTokens {
    [key: string]: any
    arrow: Partial<{
        [key: string]: any
        border: Partial<{ [key: string]: any; in: string; out: string }>
    }>
    content: Partial<CaptchaModalContentTokens>
}
/**
 * @param border 边框
 * @param shadow 阴影
 * @param background 背景色
 * @param loading 加载状态
 * @param result 结果展示
 * @param slider 滑动条
 * @param panel 底部面板
 */
export interface CaptchaModalContentTokens {
    [key: string]: any
    border: string
    shadow: string
    background: Partial<GradientTokens>
    loading: Partial<{
        [key: string]: any
        text: string
        background: Partial<GradientTokens>
        spinner: string
    }>
    result: Partial<{
        [key: string]: any
        text: string
        success: Partial<{ [key: string]: any; text: string; background: string }>
        error: Partial<{ [key: string]: any; text: string; background: string }>
    }>
    slider: Partial<{
        [key: string]: any
        text: string
        background: string
        btn: Partial<{
            [key: string]: any
            border: string
            shadow: string
            scan: Partial<{
                [key: string]: any
                line: string
                background: string
            }>
        }>
    }>
    panel: Partial<{
        [key: string]: any
        icon: string
        border: string
        copyright: Partial<{ [key: string]: any; border: string }>
    }>
}

/**
 * +======================+
 * |        面包屑        |
 * +======================+
 * @param text 文本
 * @param separator 分隔符
 *
 * @see ColorStateTokens
 */
export interface BreadcrumbTokens {
    [key: string]: any
    text: Partial<ColorStateTokens>
    separator: string
}

/**
 * +=======================+
 * |        代码高亮        |
 * +=======================+
 * @param scrollbar 滚动条
 * @param background 背景
 * @param border 边框
 * @param dot 点
 * @param copy 复制按钮
 */
export interface CodeTokens {
    [key: string]: any
    scrollbar: string
    background: string
    border: string
    dot: Partial<{
        [key: string]: any
        red: string
        orange: string
        green: string
    }>
    copy: Partial<{
        [key: string]: any
        icon: string
        background: Partial<GradientTokens>
    }>
}

/**
 * +=======================+
 * |        下拉菜单        |
 * +=======================+
 * @param item 下拉选项
 *
 * @see DropdownItemTokens
 */
export interface DropdownTokens {
    [key: string]: any
    item: Partial<DropdownItemTokens>
}
/**
 * @param text 文案
 * @param tag 标签
 */
export interface DropdownItemTokens {
    [key: string]: any
    text: string
    tag: Partial<{
        [key: string]: any
        text: string
        tag: Partial<GradientTokens>
    }>
}

/**
 * +====================+
 * |        弹窗        |
 * +====================+
 * @param btn 按钮
 * @param quick 快捷弹窗
 *
 * @see ModalBtnTokens
 * @see ModalQuickTokens
 */
export interface ModalTokens {
    [key: string]: any
    btn: Partial<ModalBtnTokens>
    quick: Partial<ModalQuickTokens>
}
/**
 * @param text 文案
 * @param active 高亮
 * @param border 边框
 */
export interface ModalBtnTokens {
    [key: string]: any
    text: Partial<{
        [key: string]: any
        default: string
        active: string
    }>
    active: Partial<GradientTokens>
    border: string
}
/**
 * @param background 背景色
 * @param border 边框
 */
export interface ModalQuickTokens {
    [key: string]: any
    border: string
    background: Partial<GradientTokens>
}

/**
 * +=====================+
 * |        调色版        |
 * +=====================+
 * @param text 文案
 * @param background 背景色
 * @param border 边框
 * @param btn 按钮
 *
 * @see PaletteBtnTokens
 */
export interface PaletteTokens {
    [key: string]: any
    text: string
    background: string
    border: string
    btn: Partial<PaletteBtnTokens>
}
/**
 * @param border 边框
 * @param text 文案
 * @param save 按钮
 */
export interface PaletteBtnTokens {
    [key: string]: any
    border: string
    text: string
    save: Partial<{
        [key: string]: any
        color: string
        start: string
        hint: string
        stop: string
    }>
}

/**
 * +=======================+
 * |        引用说明        |
 * +=======================+
 * @param text 文案
 * @param bacground 背景色
 * @param btn 按钮配色
 */
export interface QuoteTokens {
    [key: string]: any
    text: string
    bacground: Partial<GradientTokens>
    btn: Partial<{
        [key: string]: any
        text: string
        border: string
        shadow: string
        gradient: Partial<GradientTokens>
    }>
}

/**
 * +=======================+
 * |        联想搜索        |
 * +=======================+
 * @param key 关键词
 * @param loading 加载中
 * @param input 输入框
 * @param list 列表
 *
 * @see SearchInputTokens
 * @see SearchListTokens
 */
export interface SearchTokens {
    [key: string]: any
    key: string
    loading: string
    input: Partial<SearchInputTokens>
    list: Partial<SearchListTokens>
}

/**
 * @param text 文案
 * @param background 背景色
 * @param placeholder 占位符颜色
 * @param border 边框
 */
export interface SearchInputTokens {
    [key: string]: any
    text: string
    background: Partial<{
        [key: string]: any
        color: string
        gradient: Partial<GradientTokens>
    }>
    placeholder: string
    border: string
}
/**
 * @param border 边框
 * @param background 背景色
 * @param item 单项
 * @param pagination 分页
 */
export interface SearchListTokens {
    [key: string]: any
    border: string
    background: Partial<{
        [key: string]: any
        color: string
        gradient: Partial<GradientTokens>
    }>
    item: Partial<{
        [key: string]: any
        divider: string
        title: string
        summary: string
        avatar: Partial<{
            [key: string]: any
            border: string
        }>
    }>
    pagination: Partial<{
        [key: string]: any
        border: string
        background: string
        input: Partial<{
            [key: string]: any
            border: string
            text: string
        }>
        control: Partial<{
            [key: string]: any
            default: string
            disabled: string
        }>
    }>
}

/**
 * +=======================+
 * |        标题设置        |
 * +=======================+
 * @param undeline 底线
 */
export interface TitleTokens {
    [key: string]: any
    undeline: Partial<GradientTokens>
}

/**
 * +=======================+
 * |        密码设置        |
 * +=======================+
 * @param input 输入框
 * @param strength 密码强度
 */
export interface PasswordTokens {
    [key: string]: any
    input: Partial<{ [key: string]: any; border: string }>
    strength: Partial<PasswordStrengthTokens>
}
/**
 * @param item 每一项强度
 */
export interface PasswordStrengthTokens {
    [key: string]: any
    item: Partial<PasswordStrengthItemTokens>
}
/**
 * @param error 错误
 * @param success 正确
 * @param tips 提示
 * @param background 背景
 */
export interface PasswordStrengthItemTokens {
    [key: string]: any
    error: string
    success: string
    tips: string
    background: Partial<ColorStateTokens>
}

/**
 * +=======================+
 * |        锚点连接        |
 * +=======================+
 */
export interface AnchorTokens {
    [key: string]: any
    border: string
    background: Partial<GradientTokens>
    text: string
    link: Partial<{
        [key: string]: any
        text: Partial<ColorStateTokens>
    }>
}

/**
 * +=======================+
 * |        回到顶部        |
 * +=======================+
 */
export interface BacktopTokens {
    [key: string]: any
    icon: string
    background: Partial<GradientTokens>
}

/**
 * +=====================================+
 * |        登录 & 注册 & 忘记密码        |
 * +=====================================+
 */
export interface PassportTokens {
    [key: string]: any
    mask: string
    logo: Partial<{
        [key: string]: any
        border: string
    }>
    tip: Partial<{
        [key: string]: any
        important: string
    }>
    form: Partial<{
        [key: string]: any
        text: string
        error: string
        input: Partial<{
            [key: string]: any
            border: string
        }>
        btn: Partial<{
            [key: string]: any
            default: Partial<
                GradientTokens & {
                    [key: string]: any
                    text: string
                }
            >
            active: Partial<
                GradientTokens & {
                    [key: string]: any
                    text: string
                }
            >
        }>
        resend: Partial<{
            [key: string]: any
            btn: Partial<
                GradientTokens & {
                    [key: string]: any
                    text: string
                }
            >
        }>
    }>
}

/**
 * +=========================+
 * |        社会化登录        |
 * +=========================+
 */
export interface SocialiteTokens {
    [key: string]: any
    icon: string
    title: Partial<{
        [key: string]: any
        text: string
    }>
    mobile: Partial<{
        [key: string]: any
        text: string
        line: string
        icon: string
        title: Partial<{
            [key: string]: any
            text: string
            background: Partial<GradientTokens>
        }>
    }>
}
