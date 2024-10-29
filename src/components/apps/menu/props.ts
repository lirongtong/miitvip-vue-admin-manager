import { array } from 'vue-types'
import { PropTypes, type MenuTreeItem } from '../../../utils/types'

/**
 * +=========================+
 * |       菜单配置属性       |
 * +=========================+
 * @param paginationLocale Antdv 分页组件多语言配置
 * @param data 自定义菜单数据
 * @param getMenusAction 获取菜单数据的接口地址或自定义方法
 * @param getMenusMethod 获取菜单数据的接口请求方式 ( string 时有效 )
 * @param getMenusParams 获取菜单数据的接口参数
 * @param createMenusAction 新增菜单的接口地址或自定义方法
 * @param createMenusMethod 新增菜单的接口请求方式 ( string 时有效 )
 * @param createMenusParams 新增菜单的接口参数
 * @param updateMenusAction 更新菜单的接口地址或自定义方法
 * @param updateMenusMethod 更新菜单的接口请求方式 ( string 时有效 )
 * @param updateMenusParams 更新菜单的接口参数
 * @param deleteMenusAction 删除菜单的接口地址或自定义方法
 * @param deleteMenusMethod 删除菜单的接口请求方式 ( string 时有效 )
 * @param deleteMenusParams 删除菜单的接口参数
 */
export const MenuTreeProps = () => ({
    paginationLocale: PropTypes.any,
    data: array<Partial<MenuTreeItem>[]>().def([]),
    getMenusAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    getMenusMethod: PropTypes.string.def('get'),
    getMenusParams: PropTypes.object.def({}),
    createMenusAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    createMenusMethod: PropTypes.string.def('post'),
    createMenusParams: PropTypes.object.def({}),
    updateMenusAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    updateMenusMethod: PropTypes.string.def('put'),
    updateMenusParams: PropTypes.object.def({}),
    deleteMenusAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    deleteMenusMethod: PropTypes.string.def('delete'),
    deleteMenusParams: PropTypes.object.def({})
})
