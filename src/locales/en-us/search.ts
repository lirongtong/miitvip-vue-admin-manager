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
    name: `Search`,
    searching: `Searching ···`,
    placeholder: `Please enter keywords`,
    components: `Search components`,
    failed: {
        message: `Can't search without source data`,
        code: 'Error code: ',
        reason: 'Wrong reason: ',
        error: `Unknowable error`
    },
    data: [
        {
            title: `About MAP`,
            summary: `Original design intention`,
            icon: ExclamationCircleOutlined,
            path: '/about'
        },
        {
            title: `Control Center`,
            summary: `Looking at the big picture`,
            icon: DashboardOutlined,
            path: '/dashboard'
        },
        {
            title: `Get Started`,
            summary: `One eye and ten lines`,
            icon: ThunderboltOutlined,
            path: '/start'
        },
        {
            title: `Theme Customization`,
            summary: `Exquisite · So beautiful`,
            icon: CrownOutlined,
            path: '/theming'
        },
        {
            title: `Global Variables`,
            summary: `Control ten thousand with one`,
            icon: GlobalOutlined,
            path: '/tools/global'
        },
        {
            title: `Request & Response`,
            summary: `Ask for orders for the people`,
            icon: SendOutlined,
            path: '/tools/request'
        },
        {
            title: `Local Cache`,
            summary: `Fearless in the face of danger`,
            icon: SaveOutlined,
            path: '/tools/cache'
        },
        {
            title: `Utility Function`,
            summary: `Paper, ink and pen`,
            icon: ToolOutlined,
            path: '/tools/function'
        },
        {
            title: `Log in Page`,
            summary: `Pre-emptive strike`,
            icon: LoginOutlined,
            path: '/pages/login'
        },
        {
            title: `Registration Page`,
            summary: `Immediate success`,
            icon: ScheduleOutlined,
            path: '/pages/register'
        },
        {
            title: `Forget Password`,
            summary: `Forget about the source`,
            icon: QuestionCircleOutlined,
            path: '/pages/forget'
        },
        {
            title: `Basic Layout`,
            summary: `Open to all rivers`,
            icon: LayoutOutlined,
            path: '/components/layout'
        },
        {
            title: `Message Center`,
            summary: `Long eyes and flying ears`,
            icon: BellOutlined,
            path: '/components/notice'
        },
        {
            title: `Pop-up Prompt`,
            summary: `Cloud Window Fog Pavilion`,
            icon: SwitcherOutlined,
            path: '/components/modal'
        },
        {
            title: `Slider Validation`,
            summary: `Work hard · Meticulous`,
            icon: ScanOutlined,
            path: '/components/captcha'
        },
        {
            title: `Related Search`,
            summary: `A little bit of water`,
            icon: SearchOutlined,
            path: '/components/search'
        },
        {
            title: `Password Setting`,
            summary: `Tight-lipped`,
            icon: SafetyCertificateOutlined,
            path: '/components/password'
        },
        {
            title: `Anchor Connection`,
            summary: `Sit on the floor`,
            icon: BorderlessTableOutlined,
            path: '/components/anchor'
        },
        {
            title: `Menu Options`,
            summary: `Where to go`,
            icon: OrderedListOutlined,
            path: '/components/menu'
        },
        {
            title: `Drop-down List`,
            summary: `Close to water terrace`,
            icon: MenuOutlined,
            path: '/components/dropdown'
        },
        {
            title: `Exquisite Clock`,
            summary: `Time flies`,
            icon: ClockCircleOutlined,
            path: '/components/clock'
        },
        {
            title: `Code Highlighting`,
            summary: `dazzling · shining`,
            icon: CodeOutlined,
            path: '/components/code'
        },
        {
            title: `Quote`,
            summary: `Extensive research and quotations`,
            icon: WarningOutlined,
            path: '/components/quote'
        },
        {
            title: `Title Settings`,
            summary: `The finishing touch`,
            icon: AlignCenterOutlined,
            path: '/components/title'
        },
        {
            title: `Back to Top`,
            summary: `Class teacher returns to court`,
            icon: ToTopOutlined,
            path: '/components/back2top'
        },
        {
            title: `Menu Management`,
            summary: `Disappear into thin air`,
            icon: PicRightOutlined,
            path: '/advanced/menu'
        },
        {
            title: `Authority Management`,
            summary: `Covering the sky with one hand`,
            icon: SecurityScanOutlined,
            path: '/advanced/authority'
        },
        {
            title: `Apps Management`,
            summary: `Widely read`,
            icon: AppstoreAddOutlined,
            path: '/advanced/app'
        },
        {
            title: `Language Management`,
            summary: `Bold words`,
            icon: TransactionOutlined,
            path: '/advanced/language'
        }
    ]
}
