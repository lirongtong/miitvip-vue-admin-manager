import Socialite from './Socialite'
import { installs } from '../../utils/install'

export default installs(Socialite, [Socialite.Callback])
