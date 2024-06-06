import { installs } from '../../utils/install'
import Menu from './Menu'

export default installs(Menu, [Menu.SubMenu, Menu.Item, Menu.Item.Title])
