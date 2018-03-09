<template>
	<div id="login">
		<el-card class="login-card">
			<div slot="header" class="clearfix">
				<span>UT Login</span>
			</div>
			<el-form ref="loginForm" :model="loginForm" label-width="120px" :rules="loginFormRules">
				<el-form-item label="User name" prop="username" required>
					<el-input v-model="loginForm.username" auto-complete="off" size="small" autofocus  @keyup.13.native="logIn"></el-input>
				</el-form-item>
				<el-form-item label="Password" prop="password" required>
					<el-input v-model="loginForm.password" auto-complete="off" size="small" type="password" 
										@keyup.13.native="logIn"></el-input>
				</el-form-item>
			</el-form>
			<div>
				<el-button type="danger" @click="logIn" style="width:100%;">Log in</el-button>
			</div>
	</el-card>
	</div>
</template>
<style scoped>
#login {
	background: #ddd;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.login-card {
	width: 400px;
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
} from '@/config/base.imports';

const validateUsername = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('User name is required'));
	} else {
		callback();
	}
};

const validatePassword = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('Password is required'));
	} else {
		callback();
	}
};

@Component({
	name: 'Navbar',
})
export default class Navbar extends Vue {
	loginFormRules = {
		username: [
			{
				validator: validateUsername,
				trigger: 'blur',
			},
		],
		password: [
			{
				validator: validatePassword,
				trigger: 'blur',
			},
		],
	};
	loginForm = {
		username: '',
		password: '',
	};
	loginVisible: boolean = false;
	user: any = {
		name: '',
	};
	logIn(this: any) {
		this.$refs['loginForm'].validate((valid) => {
			if (valid) {
				localStorage.setItem('session', this.loginForm.username);
				localStorage.setItem('password', this.loginForm.password);
				this.$store.commit('logIn', this.loginForm);
			}
		});
	}
}
</script>
