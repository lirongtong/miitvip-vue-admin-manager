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
            icon: ExclamationCircleOutlined
        },
        {
            title: `Control Center`,
            summary: `Looking at the big picture`,
            icon: DashboardOutlined
        },
        {
            title: `Get Started`,
            summary: `One eye and ten lines`,
            icon: ThunderboltOutlined
        },
        {
            title: `Theme Customization`,
            summary: `Exquisite · So beautiful`,
            icon: CrownOutlined
        },
        {
            title: `Global Variables`,
            summary: `Control ten thousand with one`,
            icon: GlobalOutlined
        },
        {
            title: `Request & Response`,
            summary: `Ask for orders for the people`,
            icon: SendOutlined
        },
        {
            title: `Local Cache`,
            summary: `Fearless in the face of danger`,
            icon: SaveOutlined
        },
        {
            title: `Utility Function`,
            summary: `Paper, ink and pen`,
            icon: ToolOutlined
        },
        {
            title: `Log in Page`,
            summary: `Pre-emptive strike`,
            icon: LoginOutlined
        },
        {
            title: `Registration Page`,
            summary: `Immediate success`,
            icon: ScheduleOutlined
        },
        {
            title: `Forget Password`,
            summary: `Forget about the source`,
            icon: QuestionCircleOutlined
        },
        {
            title: `Basic Layout`,
            summary: `Open to all rivers`,
            icon: LayoutOutlined
        },
        {
            title: `Message Center`,
            summary: `Long eyes and flying ears`,
            icon: BellOutlined
        },
        {
            title: `Pop-up Prompt`,
            summary: `Cloud Window Fog Pavilion`,
            icon: SwitcherOutlined
        },
        {
            title: `Slider Validation`,
            summary: `Work hard · Meticulous`,
            icon: ScanOutlined
        },
        {
            title: `Related Search`,
            summary: `A little bit of water`,
            icon: SearchOutlined
        },
        {
            title: `Password Setting`,
            summary: `Tight-lipped`,
            icon: SafetyCertificateOutlined
        },
        {
            title: `Anchor Connection`,
            summary: `Sit on the floor`,
            icon: BorderlessTableOutlined
        },
        {
            title: `Menu Options`,
            summary: `Where to go`,
            icon: OrderedListOutlined
        },
        {
            title: `Drop-down List`,
            summary: `Close to water terrace`,
            icon: MenuOutlined
        },
        {
            title: `Exquisite Clock`,
            summary: `Time flies`,
            icon: ClockCircleOutlined
        },
        {
            title: `Code Highlighting`,
            summary: `dazzling · shining`,
            icon: CodeOutlined
        },
        {
            title: `Quote`,
            summary: `Extensive research and quotations`,
            icon: WarningOutlined
        },
        {
            title: `Title Settings`,
            summary: `The finishing touch`,
            icon: AlignCenterOutlined
        },
        {
            title: `Back to Top`,
            summary: `Class teacher returns to court`,
            icon: ToTopOutlined
        },
        {
            title: `Menu Management`,
            summary: `Disappear into thin air`,
            icon: PicRightOutlined
        },
        {
            title: `Authority Management`,
            summary: `Covering the sky with one hand`,
            icon: SecurityScanOutlined
        },
        {
            title: `Apps Management`,
            summary: `Widely read`,
            icon: AppstoreAddOutlined
        },
        {
            title: `Language Management`,
            summary: `Bold words`,
            icon: TransactionOutlined
        }
    ]
}
