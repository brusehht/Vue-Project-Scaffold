<template>
  <div id="navBar">
    <div class="title">
      <img :src="require('@/assets/img/navbar/ut-logo.png')" style="width:40px">
      <h2>DController</h2>
    </div>
    <div id="menu">
      <el-menu background-color="#2a3246" text-color="#838998" active-text-color="#fff" :default-active="activeIndex"
               mode="horizontal" router>
				<el-menu-item index="/">
					Topology
				</el-menu-item>
        <el-submenu index="/currentAlarm">
					<template slot="title">Fault</template>
          <el-menu-item index="/currentAlarm">
					Current Alarm
          </el-menu-item>
					<el-menu-item index="/historyAlarm">
					History Alarm
          </el-menu-item>
        </el-submenu>
				<el-submenu index="/currentPerf">
					<template slot="title">Performance</template>
          <el-menu-item index="/currentPerf">
					Current Performance
          </el-menu-item>
					<el-menu-item index="/hisotryPerf">
					Hisotry Performance
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="navTools">
      <div id="currentAlarms" class="currentAlarms">
        <div style="background-color:#FF0000">{{alarmStatic.C}}</div>
        <div style="background-color:#FFC800">{{alarmStatic.M}}</div>
        <div style="background-color:#FFFF00">{{alarmStatic.m}}</div>
        <div style="background-color:#00FFFF">{{alarmStatic.W}}</div>
        <div style="background-color:#0080FF">{{alarmStatic.I}}</div>
      </div>
      <el-menu class="user" mode="horizontal" background-color="#2a3246" text-color="#eeeef7"
               active-text-color="#fff">
        <el-submenu index="10">
          <template slot="title">{{userInfo.username}}</template>
          <el-menu-item index="10-1">
            <a @click="logOut">Log out</a>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>
<style scoped lang="scss">
#navBar {
	display: flex;
	height: 60px;
	background-color: #2a3345;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
	.title {
		display: flex;
		flex: 0 0 220px;
		align-items: center;
		img {
			margin-left: 10px;
		}
		h2 {
			font-weight: bold;
			font-size: 22px;
			color: #fff;
			margin-left: 20px;
		}
	}
	#menu {
		display: flex;
		flex: 1;
		align-items: center;
		.el-submenu {
			height: 60px;
		}
		.el-submenu .el-submenu__title {
			display: flex;
		}
	}

	.navTools {
		flex: 0 0 300px;
		display: flex;
		justify-content: flex-end;
		.currentAlarms {
			width: 200px;
			display: flex;
			height: 30px;
			margin-top: 10px;
			div {
				display: flex;
				flex: 1;
				justify-content: center;
				align-items: center;
			}
		}
		.user {
			margin-left: 20px;
			.el-submenu__title,
			.el-submenu__icon-arrow {
				color: white;
			}
		}
	}
	.el-menu--popup {
		min-width: 120px;
	}
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
	mapMutations,
} from '@/config/base.imports';

const validateUsername = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('User name is required'));
	} else {
		callback();
	}
}]]]

const validatePassword = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('Password is required'));
	} else {
		callback();
	}
};

@Component({
	name: 'Navbar',
	computed: {
		...mapState(['userInfo']),
	},
	methods: {
		...mapMutations(['logOut']),
	},
})
export default class Navbar extends Vue {
	activeIndex: string = '/';
	alarmStatic: any = {
		C: 0,
		M: 0,
		m: 0,
		W: 0,
		I: 0,
	};
	user: any = {
		name: '',
	};

	handleSelect(key, keyPath) {
		this.activeIndex = key;
	}
	async getAlarm() {
		// this.alarmStatic = await this.$$apis.alarm.getAllAlarmCounts.call(this);
		// //获取告警统计数据
		// let input = {
		// 	matchContext: {},
		// 	subject: '/alarm/statistic',
		// };
		// this.$$apis.common.getWebSocketUrl.call(this, input).then(result => {
		// 	const ws = this.$$ws.getFilteredWs(result.uriSuffix, 'Alarm statistic');
		// 	ws.onmessage = evt => {
		// 		const data = JSON.parse(evt.data);
		// 		this.alarmStatic = data;
		// 	};
		// });
	}
	setActiveMenu() {
		const activeMenu = this.$route.fullPath;
		this.activeIndex = activeMenu;
	}
	created() {
		this.setActiveMenu();
	}
}
</script>
