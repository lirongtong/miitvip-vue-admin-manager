/*
 * +-------------------------------------------+
 * |                  MIITVIP                  |
 * +-------------------------------------------+
 * | Copyright (c) 2020 makeit.vip             |
 * +-------------------------------------------+
 * | Author: makeit <lirongtong@hotmail.com>   |
 * | Homepage: https://www.makeit.vip          |
 * | Github: https://github.com/lirongtong     |
 * | Date: 2020-5-28 11:13                     |
 * +-------------------------------------------+
 */
export interface RootState {
    version: string;
}

export interface LayoutState {
	/**
	 * The left menu is to expand or collapse.
	 * @type {boolean | null}
	 */
    collapsed: boolean | null;
    active: string | null;
	opens: any[];
	mobile: boolean;
	drawer: boolean;
	small: boolean;
	type: string | null;
	routes: {};
}

export const mutations = {
	layout: {
		collapsed: 'SET_MENU_COLLAPSED',
		opens: 'SET_MENU_OPENS',
		active: 'SET_MENU_ACTIVE',
		drawer: 'IS_OPEN_DRAWER',
		mobile: 'IS_MOBILE',
		type: 'SET_SCREEN_TYPE',
		routes: 'SET_HISTORY_ROUTES'
	},
	passport: {
		user: 'SET_USER_INFO',
		token: {
			access: 'SET_ACCESS_TOKEN',
			refresh: 'SET_REFRESH_TOKEN'
		},
		refresh: 'REFRESH_TOKEN_AUTO',
		auto: 'SET_AUTO_LOGIN',
		reset: 'RESET_USER_TOKEN_AUTO'
	}
}