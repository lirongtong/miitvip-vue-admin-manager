import PropTypes from '../_utils/props-types'

export const layoutProps = () => ({
    prefixCls: String,
    sideClassName: PropTypes.string,
    menuClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    contentAnimation: PropTypes.string.def('page-slide'),
    showRouteHistory: PropTypes.bool.def(true),
    side: PropTypes.any,
    sideBackground: PropTypes.string,
    header: PropTypes.any,
    headerExtra: PropTypes.any,
    footer: PropTypes.any,
    themes: PropTypes.array
})

export const layoutHeaderProps = () => ({
    prefixCls: String,
    stretch: PropTypes.any,
    notice: PropTypes.any,
    dropdown: PropTypes.any,
    extra: PropTypes.any,
    themes: PropTypes.array
})

export const layoutSideProps = () => ({
    prefixCls: String,
    logo: PropTypes.any,
    menu: PropTypes.any,
    sideBackground: PropTypes.string
})
