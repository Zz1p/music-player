<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input type="text" focus clearable v-model="username" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button class="theme-button-color" hover-class="theme-button-color--active" @tap="bindRegister">注册</button>
		</view>
	</view>
</template>

<script>
	import mInput from '../../components/m-input.vue';
	import {
		mapActions
	} from 'vuex'
  import md5 from '@/components/md5.js'

	export default {
		components: {
			mInput
		},
		data() {
			return {
				username: '',
				password: '',
				email: ''
			}
		},
		methods: {
			...mapActions(['register', 'login']),
			bindRegister() {
				if (this.username.length < 5) {
					uni.showToast({
						icon: 'none',
						title: '账号最短为 5 个字符'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}

				const data = {
					username: this.username,
					password: md5(this.password),
					role: 'member'
				}
				this.register(data)
					.then(res => {
						if (res.errMessage) {
							uni.showToast({
								title: res.errMessage
							});
						} else {
							this.login(data)
								.then(_ => {
									this.jump2Main('注册成功');
								})
								.catch(err => console.log(err))
						}
					})
					.catch(err => console.log(err));
			},
			jump2Main(title) {
				uni.showToast({
					title: title
				});
				setTimeout(() => {
					uni.reLaunch({
						url: '../index/index',
					});
				}, 1000);
			},
		}
	}
</script>

<style lang="scss">
	// 必须有点内容，不然编译的时候就会忽略这个style，样式就会丢失
</style>
