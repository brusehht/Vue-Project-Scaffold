import Vue from 'vue';
import axios from 'axios';
import config from '@/config/index';
const { axiosconfig, axioscallback } = config;
// 动态设置本地和线上接口域名
const Axios = axios.create(axiosconfig);

// Axios的拦截器和配置要放在export外,防止拦截器多次调用引起混淆淆
Axios.interceptors.request.use(
	(conf) => {
		conf.headers.Authorization =
			'Basic ' +
			btoa(
				localStorage.getItem('session') +
					':' +
					localStorage.getItem('password'),
			);
		return conf;
	},
	(error) => {
		axioscallback.showError(error, 'request');
		return Promise.reject(error);
	},
);

Axios.interceptors.response.use(
	(response) => {
		if (response.status < 400) {
			return Promise.resolve(response.data);
		} else {
			axioscallback.showError(response, 'response');
			return Promise.reject(response);
		}
	},
	(error) => {
		axioscallback.showError(error, 'response');
		return Promise.reject(error);
	},
);
export default Axios;
