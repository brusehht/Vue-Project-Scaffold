import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/';
import './plugins/';

// element-ui
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
// import '@/assets/css/theme-custom/src/index.scss';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css';

// 自定义组件
import SearchTable from '@/components/SearchTable.vue';
import SlideDialog from '@/components/SlideDialog.vue';
import NodeSelect from '@/components/NodeSelect.vue';
import NodeTree from '@/components/NodeTree.vue';

Vue.use(ElementUI);
Vue.component(SearchTable.name, SearchTable);
Vue.component(SlideDialog.name, SlideDialog);
Vue.component(NodeSelect.name, NodeSelect);
Vue.component(NodeTree.name, NodeTree);
Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app');
