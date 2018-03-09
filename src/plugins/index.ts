import Vue from 'vue';
import utils from '../utils/';

import directive from '@/plugins/directive';
import mixin from '@/plugins//mixin';

const plugins = {
	utils,
};

/**
 * @default 注册插件到Vue对象中
 */
Vue.use({
	install(vue: any, options) {
		/**
		 * @default 递归把需要用到的方法以插件形式注册到Vue上
		 * @param  {object} target 注册目标对象，即Vue
		 * @param  {object} source 需要注册的对象
		 */
		const deepRegister = (target, source) => {
			for (const k in source) {
				if (source.hasOwnProperty(k)) {
					target.prototype['$' + k] = source[k];
				}
			}
		};
		deepRegister(Vue, plugins);
	},
});

/**
 * @default 注册全局mixin
 */
Vue.mixin(mixin);

/**
 * @default 注册全局directive
 */
for (const key in directive) {
	if (directive.hasOwnProperty(key)) {
		Vue.directive(key, directive[key]);
	}
}
