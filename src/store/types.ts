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
    collapsed: boolean | null;
    active: string | null;
	opens: any[];
	drawer: boolean;
	small: boolean;
	type: string | null;
}