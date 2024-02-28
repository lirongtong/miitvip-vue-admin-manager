import {
    ExclamationCircleOutlined,
    DashboardOutlined,
    ThunderboltOutlined,
    CrownOutlined,
    GlobalOutlined,
    SendOutlined,
    SaveOutlined,
    ToolOutlined,
    LoginOutlined,
    ScheduleOutlined,
    QuestionCircleOutlined,
    LayoutOutlined,
    BellOutlined,
    SwitcherOutlined,
    ScanOutlined,
    SearchOutlined,
    ClockCircleOutlined,
    SafetyCertificateOutlined,
    BorderlessTableOutlined,
    OrderedListOutlined,
    MenuOutlined,
    CodeOutlined,
    WarningOutlined,
    AlignCenterOutlined,
    ToTopOutlined,
    PicRightOutlined,
    SecurityScanOutlined,
    AppstoreAddOutlined,
    TransactionOutlined
} from '@ant-design/icons-vue'

export default {
    name: `搜索`,
    searching: `搜索中 ···`,
    placeholder: `请输入待搜索的关键词`,
    components: `搜索组件`,
    failed: {
        message: `源数据获取失败，无法完成搜索`,
        code: `错误代码：`,
        reason: `错误原因：`,
        error: `接口发生了不可预知的错误`
    },
    data: [
        {
            title: `关于 MAP`,
            summary: `框架特性 · 设计初衷`,
            icon: ExclamationCircleOutlined
        },
        {
            title: `控制中心`,
            summary: `纵观全局 · 运筹帷幄`,
            icon: DashboardOutlined
        },
        {
            title: `快速上手`,
            summary: `一目十行 · 滴水成冰`,
            icon: ThunderboltOutlined
        },
        {
            title: `主题定制`,
            summary: `精妙绝伦 · 美不胜收`,
            icon: CrownOutlined
        },
        {
            title: `全局变量`,
            summary: `以一驭万 · 顾全大局`,
            icon: GlobalOutlined
        },
        {
            title: `请求响应`,
            summary: `为民请命 · 响应风从`,
            icon: SendOutlined
        },
        {
            title: `本地缓存`,
            summary: `临危不惧 · 稳如泰山`,
            icon: SaveOutlined
        },
        {
            title: `工具函数`,
            summary: `笔墨纸砚 · 不拘绳墨`,
            icon: ToolOutlined
        },
        {
            title: `登录页面`,
            summary: `先发制人 · 先声夺人`,
            icon: LoginOutlined
        },
        {
            title: `注册页面`,
            summary: `欣欣向荣 · 马到成功`,
            icon: ScheduleOutlined
        },
        {
            title: `忘记密码`,
            summary: `吃水忘源 · 得新忘旧`,
            icon: QuestionCircleOutlined
        },
        {
            title: `基础布局`,
            summary: `气势磅礴 · 海纳百川`,
            icon: LayoutOutlined
        },
        {
            title: `消息中心`,
            summary: `长目飞耳 · 喜出望外`,
            icon: BellOutlined
        },
        {
            title: `弹窗提示`,
            summary: `云窗雾阁 · 巧夺天工`,
            icon: SwitcherOutlined
        },
        {
            title: `滑块验证`,
            summary: `呕心沥血 · 一丝不苟`,
            icon: ScanOutlined
        },
        {
            title: `联想搜索`,
            summary: `浮想联翩 · 蜻蜓点水`,
            icon: SearchOutlined
        },
        {
            title: `密码设置`,
            summary: `守口如瓶 · 法不传六耳`,
            icon: SafetyCertificateOutlined
        },
        {
            title: `锚点连接`,
            summary: `席地而坐 · 安家落户`,
            icon: BorderlessTableOutlined
        },
        {
            title: `菜单选项`,
            summary: `何去何从 · 爬罗剔抉`,
            icon: OrderedListOutlined
        },
        {
            title: `下拉列表`,
            summary: `近水楼台 · 顺水推舟`,
            icon: MenuOutlined
        },
        {
            title: `精美时钟`,
            summary: `弹指之间 · 时光荏苒`,
            icon: ClockCircleOutlined
        },
        {
            title: `代码高亮`,
            summary: `光彩夺目 · 熠熠生辉`,
            icon: CodeOutlined
        },
        {
            title: `引用说明`,
            summary: `繁征博引 · 深文罗织`,
            icon: WarningOutlined
        },
        {
            title: `标题设置`,
            summary: `独辟蹊径 · 画龙点睛`,
            icon: AlignCenterOutlined
        },
        {
            title: `回到顶部`,
            summary: `班师回朝 · 久客思归`,
            icon: ToTopOutlined
        },
        {
            title: `菜单管理`,
            summary: `蛛丝马迹 · 烟消云散`,
            icon: PicRightOutlined
        },
        {
            title: `权限管理`,
            summary: `一手遮天 · 卓尔不群`,
            icon: SecurityScanOutlined
        },
        {
            title: `应用管理`,
            summary: `博览群书 · 千秋万古`,
            icon: AppstoreAddOutlined
        },
        {
            title: `语言管理`,
            summary: `口若悬河 · 豪言壮语`,
            icon: TransactionOutlined
        }
    ]
}
