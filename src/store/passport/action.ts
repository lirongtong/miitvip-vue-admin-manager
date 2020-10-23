import { ActionTree } from 'vuex'
import { PassportState, RootState, mutations } from '../types'
import { $http } from '../../utils/http'
import { $api } from '../../utils/api'

export const actions: ActionTree<PassportState, RootState> = {
    login({dispatch, commit}, data: {
        url: string;
        username: string;
        password: string;
        remember: boolean | number;
        captcha: boolean;
        uuid: string;
    }): Promise<any> {
        return new Promise((resolve, reject) => {})
    }
}