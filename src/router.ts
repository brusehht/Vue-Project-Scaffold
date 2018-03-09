import Vue from 'vue';
import Store from '@/store/';
import Router from 'vue-router';
import login from './views/login.vue';
import topology from './views/topology.vue';
import currentAlarm from '@/views/currentAlarm.vue';
import currentPerf from '@/views/currentPerf.vue';
import hisotryPerf from '@/views/hisotryPerf.vue';
import historyAlarm from '@/views/historyAlarm.vue';
import config from '@/views/config.vue';

Vue.use(Router);

const router = new Router({
	routes: [
		{
			path: '/login',
			name: 'login',
			component: login,
			meta: { requiresAuth: false },
		},
		{
			path: '/',
			name: 'topology',
			component: topology,
			meta: { requiresAuth: true },
		},
		{
			path: '/currentAlarm',
			name: 'currentAlarm',
			component: currentAlarm,
			meta: { requiresAuth: true },
		},
		{
			path: '/historyAlarm/:nodeId?',
			name: 'historyAlarm',
			component: historyAlarm,
			meta: { requiresAuth: true },
		},
		{
			path: '/currentPerf/:nodeId?',
			name: 'currentPerf',
			component: currentPerf,
			meta: { requiresAuth: true },
		},
		{
			path: '/hisotryPerf',
			name: 'hisotryPerf',
			component: hisotryPerf,
			meta: { requiresAuth: true },
		},
		{
			path: '/config',
			name: 'config',
			component: config,
			meta: { requiresAuth: true },
		},
	],
});

router.beforeEach((to, from, next) => {
	if (to.path === '/login') {
		Store.commit('updateLogin', false);
	} else {
		Store.commit('updateLogin', true);
	}
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (!localStorage.getItem('authToken')) {
			Store.commit('updateLogin', false);
			next({
				path: '/login',
			});
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
