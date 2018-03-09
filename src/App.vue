<template>
  <div id="app">
    <Navbar v-if="isLogin"></Navbar>
    <main class="container">
      <router-view/>
    </main>
  </div>
</template>

<style>
#navBar #menu .el-menu--horizontal .el-submenu .el-submenu__title {
	height: 60px;
	line-height: 60px;
}
html,
body,
#app,
.container {
	height: 100%;
	overflow: hidden;
}
</style>

<script lang="ts">
import {
	Component,
	Prop,
	Vue,
	Utils,
	BaseAPI,
	CommonAPI,
	mapState,
} from '@/config/base.imports';

import Navbar from '@/components/Navbar.vue';

@Component({
	components: {
		[Navbar.name]: Navbar,
	},
	computed: {
		...mapState(['isLogin']),
	},
})
export default class App extends Vue {
	checkLogin() {
		const userInfo = localStorage.getItem('userInfo');
		if (userInfo) {
			this.$store.commit('updateUserInfo', JSON.parse(userInfo));
		}
	}
	created() {
		this.checkLogin();
	}
}
</script>
