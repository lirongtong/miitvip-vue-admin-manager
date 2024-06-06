import { installs } from '../../utils/install'
import Layout from './Layout'

export default installs(Layout, [
    Layout.Header,
    Layout.Sider,
    Layout.Sider.Logo,
    Layout.Content,
    Layout.Footer
])
