import Vue from 'vue';
import Vuex from 'vuex';
import Router from '../router';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		userInfo: {
			name: '',
		},
		isLogin: false,
	},
	mutations: {
		updateLogin(state: any, login: boolean) {
			state.isLogin = login;
		},
		updateUserInfo(state: any, userInfo) {
			state.userInfo = userInfo;
		},
		logIn(state: any, userInfo) {
			localStorage.setItem('authToken', 'test');
			localStorage.setItem('userInfo', JSON.stringify(userInfo));
			state.userInfo = userInfo;
			Router.push('/');
		},
		logOut(state: any) {
			localStorage.removeItem('authToken');
			localStorage.removeItem('userInfo');
			state.userInfo = {
				name: '',
			};
			Router.push('/login');
		},
	},
	actions: {},
});
